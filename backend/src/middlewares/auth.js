const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userauth = async (req, res, next) => {
  try {
    // 1. Read token from cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login!");
    }

    // 2. Verify token
    const decoded = jwt.verify(token, "Devtinder$790");

    const { _id } = decoded;

    // 3. Fetch user from DB (FIXED)
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    // 4. Attach user to request
    req.user = user;

    // 5. Go to next middleware / route
    next();

  } catch (err) {
    res.status(401).send("Auth Error: " + err.message);
  }
};

module.exports = userauth;
