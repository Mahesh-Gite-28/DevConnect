const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"//reference to the User Model 
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accept", "reject"],
      message: "{VALUE} is incorrect status type",
    },
  },
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1},{ unique: true });

connectionRequestSchema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("cannot send connection request to yourself");
  }
});

const ConnectionRequest=new mongoose.model("ConnectionRequest",connectionRequestSchema,"ConnectionRequests");

module.exports=ConnectionRequest;
