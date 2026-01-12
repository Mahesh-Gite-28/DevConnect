const express=require("express");

const requestRouter=express.Router();

const userauth=require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest",userauth,(req,res)=>{

    const user=req.user;

    console.log("sending connection request");

    res.send(user.firstName+" sent the connection request");
})


module.exports=requestRouter;


