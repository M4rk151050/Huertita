const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const Contact = require("../../models/Contact");
const User = require("../../models/User");
const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin", async (req, res) => {
  const userCount = await User.countDocuments({});
  const productCount = await Product.countDocuments({});
  const contactCount = await Contact.countDocuments({});
  const contactPending = await Contact.countDocuments({ state: 0 });
  const lastContacts = await Contact.find({}).limit(6).exec();

  return res.json({
    ok: true,
    userCount,
    productCount,
    contactCount,
    contactPending,
    lastContacts,
  });
});

module.exports = router;
