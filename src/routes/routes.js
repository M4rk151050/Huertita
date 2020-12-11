const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const products = await Product.find().limit(6).exec();
  res.json({ ok: true, products });
});

// router.get("/about", (req, res) => {
//   res.render("pages/about.html", { title: "Nosotros", file: "about" });
// });

module.exports = router;
