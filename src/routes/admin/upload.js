const express = require("express");
const router = express();
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");

const Product = require("../../models/Product");
const { isAuthenticated, isAdmin } = require("../../helpers/auth");

router.use(
  fileUpload({
    // useTempFiles: true,
  })
);

router.post(
  "/admin/upload/:id",

  async (req, res) => {
    const id = req.params.id;

    if (!req.files)
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha seleccionado un archivo",
        },
      });

    const image = req.files.image;
    const validExtensions = ["png", "jpg", "gif", "jpeg"];
    const cutName = image.name.split(".");
    const extension = cutName[cutName.length - 1];

    if (!validExtensions.includes(extension))
      return res.status(400).json({
        ok: false,
        err: {
          message: "Las extensiones validas son: " + validExtensions.join(", "),
        },
        ext: extension,
      });

    const imageName = `${id}.${extension}`;

    image.mv(`src/public/img/products/${imageName}`, (err) => {
      if (err) return res.status(500).json({ ok: false, err });
      updateProduct(id, res, req, imageName);
    });
  }
);

router.get(
  "/admin/upload/:id/delete",

  async (req, res) => {
    const id = req.params.id;

    Product.findByIdAndRemove(id, (err, product) => {
      if (err) return res.status(400).json({ ok: false, err });

      if (product === null)
        return res.status(400).json({
          ok: false,
          err: { message: "Id no encontrado" },
        });

      deleteFile(product.photo_url);
      res.json({ ok: true });
    });
  }
);

function updateProduct(id, res, req, imageName) {
  Product.findById(id, (err, product) => {
    if (err) {
      deleteFile(imageName);
      return res.status(500).json({ ok: false, err });
    }

    if (!product) {
      deleteFile(imageName);
      return res.status(400).json({
        ok: false,
        err: { message: "El producto no existe" },
      });
    }

    // if (product.photo_url) deleteFile(product.pho	to_url);

    product.photo_url = imageName;

    product.save((err, productDB) => {
      if (err) return res.status(500).json({ ok: false, err });
      res.json({ ok: true });
    });
  });
}

function deleteFile(fileName) {
  const pathFile = path.resolve(
    __dirname,
    `../../public/img/products/${fileName}`
  );
  if (fs.existsSync(pathFile)) {
    fs.unlinkSync(pathFile);
  }
}

module.exports = router;
