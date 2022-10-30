const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);
app.use(userRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ error: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
