const express=require("express");

const requestRouter=express.Router();

const userauth=require("../middlewares/auth");

const ConnectionRequest=require("../Models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:touserId",
  userauth,
  async (req, res) => {
    try {
      const fromID = req.user._id;
      const toID = req.params.touserId;
      const status = req.params.status;

      const Connection = new ConnectionRequest({
        fromUserId: fromID,
        toUserId: toID,
        status,
      });

      const data = await Connection.save();

      res.status(201).json({
        message: "Connection Request Sent Successfully!",
        data,
      });
    } catch (err) {
      console.error(err); // 👈 IMPORTANT
      res.status(400).json({ error: err.message });
    }
  }
);


module.exports=requestRouter;


