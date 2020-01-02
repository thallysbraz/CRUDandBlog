const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de Artigo");
});
//rota para renderizar view de add artigo

router.get("/admin/articles/new", (req, res) => {
  res.render("admin/articles/new");
});

router.post("/save", (req, res) => {
  console.log("ok, save");
});

module.exports = router;

//tiny.cloud/get-tiny/language-packages
