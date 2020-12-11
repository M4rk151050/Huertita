const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/products", async (req, res) => {
  const products = await Product.find();

  res.json({ ok: true, products });
});

router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ ok: true, product });
});

module.exports = router;
