const express = require("express");

const profileRouter = express.Router();

const userauth = require("../middlewares/auth");

const { validateProfileEdits,validatePassword} = require("../utils/validation");

profileRouter.get("/profile/view", userauth, async (req, res) => {
  const user = req.user;

  res.send(user);
});

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
  try {
    if (!validateProfileEdits(req.body)) {
      throw new Error("Edits not allowed");
    }

    const loggedInUser = req.user;

    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "skills",
      "about"
    ];

    Object.keys(req.body).forEach((field) => {
      if (
        allowedFields.includes(field) &&
        req.body[field] !== "" &&
        req.body[field] !== null &&
        req.body[field] !== undefined
      ) {
        loggedInUser[field] = req.body[field];
      }
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    console.log("EDIT PROFILE ERROR:", err);
    res.status(400).json({
      error: err.message || "Profile update failed",
    });
  }
});


profileRouter.patch("/profile/password", userauth, async (req, res) => {
  try {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password required");
    }

    const user = req.user;

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    if(!validatePassword(newPassword))
        {
            throw new Error("please enter strong password");
        } 

    user.password = newPassword;

    user.password = await user.gethash();

    await user.save();

    res.json({
      message: "Password changed successfully."
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = profileRouter;
