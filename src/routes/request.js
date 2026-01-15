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
    fromUserId:requestId,//695ee8c3e578fb812563a907
    toUserId:loggedInUser._id,//696781d8bcd151ef4ea3cfda
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
