const mongoose=require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://Mahesh_Brand:VmB0o1lmrj6ROOHy@devtinderdbappserver.ymgcub3.mongodb.net/devtinder");
}

module.exports={connectDB};