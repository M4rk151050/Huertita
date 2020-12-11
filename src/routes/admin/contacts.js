const express = require("express");
const router = express.Router();
const Contact = require("../../models/Contact");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/contacts", async (req, res) => {
  const contacts = await Contact.find();

  res.json({ ok: true, contacts });
});

router.put("/admin/contacts/:id", (req, res) => {
  const id = req.params.id;

  Contact.findByIdAndUpdate(id, { state: 1 }, { new: true }, (err, contact) => {
    if (err) return res.status(400).json({ ok: false, err });

    res.json({ ok: true });
  });
});

router.put("/admin/contacts/:id/pending", (req, res) => {
  const id = req.params.id;

  Contact.findByIdAndUpdate(id, { state: 0 }, { new: true }, (err, contact) => {
    if (err) return res.status(400).json({ ok: false, err });

    res.json({ ok: true });
  });
});

router.delete("/admin/contacts/:id", (req, res) => {
  const id = req.params.id;

  Contact.findByIdAndRemove(id, (err, contact) => {
    if (err) return res.status(400).json({ ok: false, err });

    if (contact === null)
      return res.status(400).json({
        ok: false,
        err: { message: "Id no encontrado" },
      });

    res.json({ ok: true });
  });
});

module.exports = router;
