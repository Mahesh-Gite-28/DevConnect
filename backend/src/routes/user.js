const express = require("express");
const userauth = require("../middlewares/auth");

const userRouter = express.Router();

const ConnectionRequest = require("../Models/connectionRequest");

const User = require("../Models/User");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

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
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId");

    // 2️⃣ Build hide list (ONLY the other user)
    const hideUsersFromFeed = connectionRequests.map((conn) => {
      if (conn.fromUserId.toString() === loggedInUserId.toString()) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    // 3️⃣ Final feed query
    const feed = await User.find({
      $and: [
        { _id: { $nin: hideUsersFromFeed } },   // exclude connected users
        { _id: { $ne: loggedInUserId } }        // exclude self
      ]
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json(feed);
  } catch (err) {
    console.error("FEED ERROR:", err);
    res.status(400).send("Error: " + err.message);
  }
});


module.exports = userRouter;
