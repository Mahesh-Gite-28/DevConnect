express=require("express");

const User=require("./Models/User"); 

const bcrypt=require("bcrypt");

const cookieParser=require("cookie-parser")

const validateSignUpData=require("./utils/validation");

const jwt=require("jsonwebtoken");

const {connectDB}=require("./config/database");
// const {auth,userauth} = require("./middlewares/auth");

app=express();

app.use(cookieParser());//helps to read the cookie

app.use(express.json());//inbuild middleware of express to read data in the body 

app.delete("/delete",async (req,res)=>{
    try
    {
        await User.findByIdAndDelete(req.body);
        res.send("delete user successfully");
    }
    catch(err)
    {
        res.status(404).send("user not found");
    }
})


app.post("/login" ,async (req,res)=>{
    try{

        const {emailID,password}=req.body;

        const user=await User.findOne({emailID:emailID});

        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPassvalid=await bcrypt.compare(password,user.password);

        if(isPassvalid){

            //create JWT token 
            const token=

            //insert token into cookie and send to client 

            res.cookie("token","jfaklsjdfjaiosjfisodnfoisjd");

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


app.get("/profile" ,(req,res)=>{

    const {token}=req.cookies;

    console.log(token);

    //is token valid or not check 

    res.send("profile of the user");
})

app.post("/signup",async (req,res)=>{
  try {
    //validation
     validateSignUpData(req);

     //encryption
    const {firstName,lastName,emailID,password}=req.body;

    const hashpass=await bcrypt.hash(password,10);//password encryption

    //create + save 
    await User.create(

        {firstName:firstName,
         lastName:lastName,
         emailID:emailID,
         password:hashpass
        }
    );
    res.status(201).send("data saved successfully");
} catch (err) {
    res.status(400).send("Error Msg: "+err.message);
}

})

app.get("/user",async (req,res)=>{
    
    try{
        const user=await User.findOne(req.body);
        if(user.length==0)
        {
             res.status(404).send("user not found");
        }
        else
        {
            res.send(user);
        }
    }
    catch(err)
    {
        res.status(404).send("user not found");
    }

})

app.get("/feed",async (req,res)=>{
    
    try{
        const user=await User.find();
        res.send(user);
    }
    catch(err)
    {
        res.status(404).send("user not found");
    }

})

app.get("/user/:id",async (req,res)=>
{
    try{
        const user=await User.findById(req.params.id);
        res.send(user);
    }
    catch(err)
    {
        res.status(404).send("user not found");
    }
})


app.patch("/user/:id", async (req, res) => {
  try {

    const allowupdates=["gender","age","skills","about"];

    const updates = Object.keys(req.body);

    const checkvalidate=updates.every((k)=>allowupdates.includes(k));

    if(!checkvalidate){
        return res.send("cannot be updated");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,   // 🔹 ID from URL
      req.body,        // 🔹 Only fields to update
      {
        runValidators: true, // 🔥 schema validation ON
        new: true            // 🔥 return updated document
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


connectDB().then(()=>{
    console.log("Database connection estabilished....");
    app.listen(7777,()=>{
    console.log("server is listening on port 7777.......");
})
}).catch((err)=>{
    console.error("Database cannot be connected");
})






