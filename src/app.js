express=require("express");

const User=require("./Models/User"); 

const {connectDB}=require("./config/database");
// const {auth,userauth} = require("./middlewares/auth");

app=express();

app.post("/signup",async (req,res)=>{

    //creating the new instance of User model 
    const user=new User(
        {
        firstName:"avi",
        lastName:"Gamer",
        emailID:"gamer@gmail.com",
        password:"game@123"
       
    }
    );

  try {
    await user.save();//save in the database
    res.status(201).send("data saved successfully");
} catch (err) {
    res.status(500).send(err.message);
}

})

connectDB().then(()=>{
    console.log("Database connection estabilished....");
    app.listen(7777,()=>{
    console.log("server is listening on port 7777.......");
})
}).catch((err)=>{
    console.error("Database cannot be connected");
})






