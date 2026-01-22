const express = require("express");

const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../Models/User");

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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isPassvalid = await user.comparePassword(password);

    if (!isPassvalid) {
      return res.status(401).send("Invalid email or password"); 
    }

    const token = await user.getjwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).send(user);

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});


authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successfull !!");
});

module.exports = authRouter;
