express=require("express");

app=express();

app.get("/user/:Id",(req,res)=>{
    console.log(req.query);
    console.log(req.params);
    res.send("what is query parameters and route parameters??");
})


app.listen(7777,()=>{
    console.log("server is listening on port 7777.......");
})

