const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            minLength:4,
            maxLength:15
        },
        lastName:{
            type:String,
            required:true,
        },
        emailID:{
            type:String,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
        },
        age:{
            type:Number,
            min:18
        },
        gender:{
            type:String,
            validate(value)
            {
                if(!["male","female","others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
            }
        },
        photoUrl:{
            type:String
        },
        skills:{
            type:[String]
        },
        about:{
            type:String,
            default:"This is a dafault about of user"
        },
    },
    {
        timestamps:true
    }
)


module.exports=mongoose.model("User",userSchema,"Users");//user Model
