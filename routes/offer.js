const express = require("express");

const router = express.Router();
const fileUpload = require("express-fileupload");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/isAuthenticated");
const cloudinary = require("cloudinary");

const convertToBase64 = (file) => {
  return `data:${file.minetype};base64,${file.data.toString("base64")}`;
};
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const {
        title,
        description,
        price,
        condition,
        city,
        brand,
        size,
        color,
        picture,
      } = req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ETAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        owner: req.user,
      });

      await newOffer.save();
      //const result = await cloudinary.uploader.upload(
      //  convertToBase64(req.files.picture)
      //);
      //console.log(result);
      res.json(newOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);
router.get("/offers", async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
