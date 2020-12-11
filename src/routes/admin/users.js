const express = require("express");
const router = express.Router();
const User = require("../../models/User");

const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.get("/admin/users", async (req, res) => {
  const users = await User.find();

  res.json({ ok: true, users });
});

router.delete("/admin/users/:id", (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, user) => {
    if (err) return res.status(400).json({ ok: false, err });

    if (user === null)
      return res.status(400).json({
        ok: false,
        err: { message: "Id no encontrado" },
      });

    res.json({ ok: true });
  });
});

module.exports = router;
