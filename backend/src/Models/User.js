const mongoose = require("mongoose");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [4, "First name must be at least 4 characters"],
      maxlength: [15, "First name must be less than 15 characters"],
      trim: true
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true
    },

    emailID: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address"
      }
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"]
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female or others"
      }
    },

    photoUrl: {
      type: String,
      default:"https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg",
      validate: {
        validator: value => !value || validator.isURL(value),
        message: "Invalid photo URL"
      }
    },

    skills: {
      type: [String],
      validate: {
        validator: arr => arr.length <= 20,
        message: "Maximum 20 skills allowed"
      }
    },

    about: {
      type: String,
      default: "This is a default about of user"
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.getjwt=async function(){

  const user=this;
  const token=await jwt.sign({_id:user._id},"Devtinder$790",{expiresIn:'7d'});
  
  return token;
}


userSchema.methods.gethash=async function (){
  const hashpass=await bcrypt.hash(this.password,10);

  return hashpass;
}

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "Users");

