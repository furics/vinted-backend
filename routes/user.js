const express = require("express");
const mongoose = require("mongodb");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const router = express.Router();

const User = require("../models/User");
router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;

    if (!username || !email || !password) {
      return res.status(404).json({ message: "missing parameter" });
    }

    const userExist = await User.findOne({ email });
    //console.log(userExist);

    if (userExist) {
      return res.status(409).json({ message: "This email already exist" });
    }

    //console.log(req.body);
    const token = uid2(64);
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    //console.log(hash);
    //console.log(token, salt);
    const newUser = new User({
      email: email,
      account: {
        username,
      },
      newsletter: newsletter,
      token: token,
      salt: salt,
      hash: hash,
    });
    await newUser.save();
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized 1" });
    }

    const newHash = SHA256(password + user.salt).toString(encBase64);

    if (newHash !== user.hash) {
      return res.status(401).json({ message: "Unauthorized 2" });
    }
    res.json({
      _id: user._id,
      token: user.token,
      account: user.account,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
