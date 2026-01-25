const express = require("express");

const requestRouter = express.Router();

const userauth = require("../middlewares/auth");

const ConnectionRequest = require("../Models/connectionRequest");

const User=require("../Models/User");

requestRouter.post(
  "/request/send/:status/:touserId",
  userauth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // ❌ self-request block
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot send request to yourself" });
      }

      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(404).json({ message: "Target user does not exist" });
      }

      // 🔒 HARD DUPLICATE BLOCK (both directions)
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists between these users"
        });
      }

      const connection = await ConnectionRequest.create({
        fromUserId,
        toUserId,
        status
      });

      res.status(201).json({
        message: req.user.firstName + " is " + status + " in " + user.firstName,
        data: connection
      });
    } catch (err) {
      console.error("SEND REQUEST ERROR:", err);
      res.status(400).json({ error: err.message });
    }
  }
);




requestRouter.post("/request/review/:status/:requestId",userauth,async(req,res)=>{
  try{

  const loggedInUser=req.user;
  const {status,requestId}=req.params;

  const allowedStatus=["accept","reject"];

  if(!allowedStatus.includes(status))
  {
    return res.status(400).json({message:"status is not valid"});
  }

  const connection=await ConnectionRequest.findOne({
    fromUserId:requestId,
    toUserId:loggedInUser._id,
    status:"interested"
  })

  if(!connection)
  {
    return res.status(404).json({message:"connection request not found!"});
  }

  connection.status=status;

  const data=await connection.save();

  res.json({message:"connection "+status+" successfully",
    data
  })

  }catch(err)
  {
    res.status(400).send("Error: "+err.message)
  }
})

module.exports = requestRouter;
