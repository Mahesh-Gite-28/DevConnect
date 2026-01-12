const express=require("express");

const authRouter=express.Router();

const validateSignUpData=require("../utils/validation");
const User=require("../Models/User");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    // create document instance
    const user = new User(req.body);

    // hash password using schema method
    user.password = await user.gethash();

    // save to DB
    await user.save();

    res.status(201).send("data saved successfully");
  } catch (err) {
    res.status(400).send("Error Msg: " + err.message);
  }
});

authRouter.post("/login" ,async (req,res)=>{
    try{

        const {emailID,password}=req.body;

        const user=await User.findOne({emailID:emailID});

        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPassvalid=await user.comparePassword(password);

        if(isPassvalid){

            //create JWT token 
            const token=await user.getjwt();

            //insert token into cookie and send to client 

            res.cookie("token",token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});

            res.send("login successfull")
        }
        else{
            res.send("password is not correct");
        }

    }catch(err)
    {
        res.status(400).send("Error:" + err.message);
    }

})

module.exports=authRouter;