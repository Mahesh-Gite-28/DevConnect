const express = require("express");
const userauth = require("../middlewares/auth");

const userRouter = express.Router();

const ConnectionRequest = require("../Models/connectionRequest");

const User = require("../Models/User");

const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender about skills membershipType membershipExpiry";

userRouter.get("/user/requests/recieved", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const Connections = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = Connections.map((row) => row.fromUserId);
    res.json({
      message: "Data fetched Successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accept",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accept",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // 1️⃣ Get all connection records of logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    // 2️⃣ Build hide list (ONLY the other user)
    const hideUsersFromFeed = connectionRequests.map((conn) => {
      if (conn.fromUserId.toString() === loggedInUserId.toString()) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    // 3️⃣ Aggregate query with priority logic
    const feed = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: [...hideUsersFromFeed, loggedInUserId],
          },
        },
      },

      // 🥇 Add priority field
      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                { case: { $eq: ["$membershipType", "Gold"] }, then: 1 },
                { case: { $eq: ["$membershipType", "Silver"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },

      // 🔥 Sort by priority then newest users
      {
        $sort: {
          priority: 1,
          createdAt: -1,
        },
      },

      { $skip: skip },
      { $limit: limit },

      // Send only safe fields
      {
        $project: {
          firstName: 1,
          lastName: 1,
          photoUrl: 1,
          age: 1,
          gender: 1,
          about: 1,
          skills: 1,
          membershipType: 1,
        },
      },
    ]);

    res.status(200).json(feed);
  } catch (err) {
    console.error("FEED ERROR:", err);
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/search", userauth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { query } = req.query;

    // 🔐 Validation
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const safeQuery = query.trim();

    if (safeQuery === "") {
      return res.status(400).json({ message: "Search query required" });
    }

    // 📄 Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    // 🔍 Split query words
    const words = safeQuery.split(" ").filter(Boolean);

    let nameCondition;

    // 🟢 Single word search
    if (words.length === 1) {
      nameCondition = {
        $or: [
          { firstName: { $regex: "^" + words[0], $options: "i" } },
          { lastName: { $regex: "^" + words[0], $options: "i" } }
        ]
      };
    }

    // 🟢 Two words search (rahul sharma)
    else {
      nameCondition = {
        $and: [
          { firstName: { $regex: "^" + words[0], $options: "i" } },
          { lastName: { $regex: "^" + words[1], $options: "i" } }
        ]
      };
    }

    // 1️⃣ Get all connection records of logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId");

    // 2️⃣ Build exclude list
    const excludeUsers = connectionRequests.map((conn) =>
      conn.fromUserId.toString() === loggedInUserId.toString()
        ? conn.toUserId
        : conn.fromUserId
    );

    // 3️⃣ Final Query
    const users = await User.find({
      $and: [
        nameCondition,
        {
          _id: { $nin: [...excludeUsers, loggedInUserId] }
        }
      ]
    })
      .select(
        "firstName lastName photoUrl age gender about skills membershipType"
      )
      .skip(skip)
      .limit(limit);

    res.status(200).json(users);

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



userRouter.get("/user/smart-matches", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserId = loggedInUser._id;

    const mySkills = (loggedInUser.skills || []).map(s =>
      s.toLowerCase()
    );

    if (mySkills.length === 0) {
      return res.status(200).json([]);
    }

    // 📄 Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // 1️⃣ Get interacted users
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId");

    const excludeUsers = connectionRequests.map((conn) =>
      conn.fromUserId.toString() === loggedInUserId.toString()
        ? conn.toUserId
        : conn.fromUserId
    );

    // 2️⃣ Aggregation pipeline
    const smartMatches = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: [...excludeUsers, loggedInUserId]
          }
        }
      },

      // Convert skills to lowercase
      {
        $addFields: {
          lowerSkills: {
            $map: {
              input: "$skills",
              as: "skill",
              in: { $toLower: "$$skill" }
            }
          }
        }
      },

      // Calculate common skills
      {
        $addFields: {
          commonSkills: {
            $size: {
              $setIntersection: ["$lowerSkills", mySkills]
            }
          },
          totalSkills: {
            $size: {
              $setUnion: ["$lowerSkills", mySkills]
            }
          }
        }
      },

      // Calculate Jaccard score
      {
        $addFields: {
          matchScore: {
            $cond: [
              { $eq: ["$totalSkills", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$commonSkills", "$totalSkills"] },
                      100
                    ]
                  },
                  0
                ]
              }
            ]
          }
        }
      },

      // Hide 0% matches
      {
        $match: {
          matchScore: { $gt: 0 }
        }
      },

      // Sort by score + newest
      {
        $sort: {
          matchScore: -1,
          createdAt: -1
        }
      },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          photoUrl: 1,
          age: 1,
          gender: 1,
          about: 1,
          skills: 1,
          membershipType: 1,
          matchScore: 1
        }
      }
    ]);

    res.status(200).json(smartMatches);

  } catch (err) {
    console.error("SMART MATCH ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


module.exports = userRouter;
