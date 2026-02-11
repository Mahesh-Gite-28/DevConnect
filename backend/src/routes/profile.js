const express = require("express");

const User = require("../Models/User");

const profileRouter = express.Router();

const userauth = require("../middlewares/auth");

const {
  validateProfileEdits,
  validatePassword,
} = require("../utils/validation");

const upload = require("../middlewares/upload");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

const deleteOldImageFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const url = new URL(imageUrl);
    const key = decodeURIComponent(url.pathname.substring(1));

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      }),
    );
  } catch (err) {
    console.log("Error deleting old image:", err.message);
  }
};

profileRouter.get("/profile/view", userauth, async (req, res) => {
  const user = req.user;

  res.send(user);
});

profileRouter.patch(
  "/profile/edit",
  userauth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      // 🔥 1. Handle image upload
      if (req.file) {
        const oldPhoto = loggedInUser.photoUrl;

        if (
          oldPhoto &&
          oldPhoto !== process.env.DEFAULT_PROFILE_PHOTO &&
          oldPhoto.includes(process.env.AWS_BUCKET_NAME)
        ) {
          await deleteOldImageFromS3(oldPhoto);
        }

        loggedInUser.photoUrl = req.file.location;
      }

      // 🔥 2. Make sure req.body exists
      const body = req.body || {};

      // 🔥 3. Update text fields safely
      if (body.firstName) loggedInUser.firstName = body.firstName;
      if (body.lastName) loggedInUser.lastName = body.lastName;
      if (body.age) loggedInUser.age = body.age;
      if (body.gender) loggedInUser.gender = body.gender;
      if (body.about) loggedInUser.about = body.about;

      if (body.skills) {
        try {
          loggedInUser.skills = JSON.parse(body.skills);
        } catch {
          loggedInUser.skills = [];
        }
      }

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
  },
);

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

    if (!validatePassword(newPassword)) {
      throw new Error("please enter strong password");
    }

    user.password = newPassword;

    user.password = await user.gethash();

    await user.save();

    res.json({
      message: "Password changed successfully.",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

profileRouter.get("/profile/targetUser/:id", userauth, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "firstName lastName photoUrl",
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Something went wrong" });
  }
});

module.exports = profileRouter;
