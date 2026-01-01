express=require("express");

app=express();

// app.use("/user",(req,res)=>{
//     res.send("ladle ghop ghop ghop");
// })

app.get("/user",(req,res)=>
{
    res.send({"firstname":"mahesh","lastname":"gite"});
})

app.post("/user",(req,res)=>
{
    res.send("user data saved successfully");
})

app.delete("/user",(req,res)=>
{
    res.send("user data deleted successfully");
})


app.listen(7777,()=>{
    console.log("server is listening on port 7777.......");
})

