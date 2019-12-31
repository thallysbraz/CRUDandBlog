const express = require("express");
const slugify = require("slugify");
const router = express.Router();

//Importando Model de Categoria
const Category = require("./Category");

router.get("/", (req, res) => {
  res.send("Rota de categoria");
});

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.post("/save", (req, res) => {
  const title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title)
    })
      .then(() => {
        res.redirect("/");
      })
      .catch(error => {
        res.status(404).json({
          msg: "Error ao pesquisar resposta, por favor, refazer a busca",
          error: error
        });
      });
  } else {
    res.redirect("/categories/admin/categories/new");
  }
});

module.exports = router;
