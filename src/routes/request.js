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

      const user=await User.findById(toUserId);

      if(!user){
        return res.send("the user not exist");
      }
      
      //if there is an existing connectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne(
       {
        $or:[
          {
            fromUserId,toUserId
          },
          {
            fromUserId:toUserId,
            toUserId:fromUserId
          }
        ]
       }
    );

    if(existingConnectionRequest){
      return res.send("unable to send the request");
    }
      const Connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await Connection.save();

      res.status(201).json({
        message: req.user.firstName+" is "+status+" in "+user.firstName,
        data,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = requestRouter;
