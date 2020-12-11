const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/products", async (req, res) => {
  const products = await Product.find();

  res.json({ ok: true, products });
});

router.post("/admin/products", async (req, res) => {
  const { name, description, price } = req.body;
  const errors = [];

  if (name.length === 0) {
    errors.push({ text: "El nombre es requerido" });
  }
  if (description.length === 0) {
    errors.push({ text: "La descripcion es requerida" });
  }
  if (price.length === 0) {
    errors.push({ text: "El precio es requerido" });
  }
  const existProduct = await Product.findOne({ name });
  if (existProduct) {
    errors.push({ text: "El nombre ya está registrado" });
  }

  if (errors.length > 0) {
    return res.status(500).json({ ok: false, errors });
  }

  const newProduct = new Product({ name, description, price });
  await newProduct.save();

  res.json({ ok: true });
});

router.get(
  "/admin/products/:id",
  [isAuthenticated, isAdmin],
  async (req, res) => {}
);

router.put(
  "/admin/products/:id",
  [isAuthenticated, isAdmin],
  async (req, res) => {
    const id = req.params.id;
    const { name, description, price } = req.body;
    const errors = [];

    if (name.length === 0) {
      errors.push({ text: "El nombre es requerido" });
    }
    if (description.length === 0) {
      errors.push({ text: "La descripcion es requerida" });
    }
    if (price.length === 0) {
      errors.push({ text: "El precio es requerido" });
    }

    if (errors.length > 0) {
      return res.status(500).json({ ok: false, errors });
    }

    Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true },
      (err, product) => {
        if (err) return res.status(400).json({ ok: false, err });
        res.json({ ok: true });
      }
    );
  }
);

router.delete("/admin/products/:id", (req, res) => {
  const id = req.params.id;

  res.redirect(`/admin/upload/${id}/delete`);
});

module.exports = router;
