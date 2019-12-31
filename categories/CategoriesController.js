const express = require("express");
const slugify = require("slugify");
const router = express.Router();

//Importando Model de Categoria
const Category = require("./Category");

//rotas de categoria
//rota para admin ver form de categorias
router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new"); //renderizando form de cadastro de categoria
});

//rota para salvar novas categorias
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
          msg: "Error ao salvar titulo de categoria, por favor, refazer.",
          error: error
        });
      });
  } else {
    res.redirect("/categories/admin/categories/new");
  }
});

//rota para listar as categorias
router.get("/admin/categories", (req, res) => {
  //Buscando Categorias no Banco de dados
  Category.findAll({
    order: [["title", "ASC"]]
  })
    .then(categories => {
      res.render("admin/categories/index", {
        categories: categories
      });
    })
    .catch(error => {
      res.status(404).json({
        msg: "Error ao listar categorias, por favor",
        error: error
      });
    });
});

module.exports = router;
