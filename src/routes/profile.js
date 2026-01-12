const express=require("express");

const profileRouter=express.Router();

const userauth=require("../middlewares/auth");

profileRouter.get("/profile",userauth,async (req,res)=>{

    const user=req.user;

    res.send(user);

})

module.exports=profileRouter;