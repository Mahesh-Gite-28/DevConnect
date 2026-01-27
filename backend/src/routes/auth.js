const express = require("express");

const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../Models/User");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const user = new User(req.body);

    user.password = await user.gethash();

    await user.save();

    const token = await user.getjwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).send(user);

  } catch (err) {

    if (err.code === 11000) {
      return res.status(400).json({
        errors: "This email is already registered",
      });
    }

    if (err.message) {
      return res.status(400).json({
        errors: err.message,
      });
    }

    res.status(500).json({
      errors: "Signup failed",
    });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID });

    if (!user) {
      return res.status(401).json({
        errors: "Invalid email or password",
      });
    }

    const isPassvalid = await user.comparePassword(password);

    if (!isPassvalid) {
      return res.status(401).json({
        errors: "Invalid email or password",
      });
    }

    const token = await user.getjwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).send(user);

  } catch (err) {

    // 🔥 CLEAN ERROR HANDLING (NO LOGIC CHANGE)
    res.status(500).json({
      errors: "Login failed. Please try again.",
    });
  }
});


authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "lax",
  });

  res.send("Logout successful");
});

module.exports = authRouter;
