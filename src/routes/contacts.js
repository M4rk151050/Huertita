const moment = require("moment");
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

const { isAuthenticated, isAdmin, isUser } = require("../helpers/auth");

// router.get("/contact", [isAuthenticated, isUser], (req, res) => {
//   res.render("pages/contact.html", { title: "Contacto", file: "contact" });
// });

router.post("/contact", async (req, res) => {
  const { name, lastname, phone, message } = req.body;
  const errors = [];

  if (name.length === 0) {
    errors.push({ text: "El nombre es requerido" });
  }
  if (lastname.length === 0) {
    errors.push({ text: "El apellido es requerido" });
  }
  if (phone.length === 0) {
    errors.push({ text: "El telefono es requerido" });
  }
  if (message.length === 0) {
    errors.push({ text: "El mensaje es requerido" });
  }

  const email = req.user.email;

  if (errors.length > 0) {
    return res.status(500).json({ ok: false, errors });
    // req.flash("error_msg", errors);
    // req.flash("data", { name, lastname, phone, message });
    // res.redirect("/contact");
  }

  const newContact = new Contact({ name, email, phone, message });
  newContact.dateShow = moment(Date.now()).format("DD-MM-YY   hh:mm:ss");
  await newContact.save();

  return res.json({ ok: true });
});

module.exports = router;
