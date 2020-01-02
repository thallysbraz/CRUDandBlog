const express = require("express");

const router = express.Router();

//Carregando Models
const Category = require("../categories/Category"); // Categoria
const Article = require("./Article"); // Artigo

//rotas
router.get("/", (req, res) => {
  res.send("Rota de Artigo");
});

//rota para renderizar view de add artigo
router.get("/admin/articles/new", (req, res) => {
  //Pesquisando as categorias e passando para a view
  Category.findAll()
    .then(categories => {
      res.render("admin/articles/new", {
        categories: categories
      });
    })
    .catch(error => {
      // se der erro interno, mostra json ao usuário com o erro.
      res.status(404).json({
        msg: "Error interno ao listar as categorias",
        error: error
      });
    });
});

router.post("/save", (req, res) => {
  console.log("ok, save");
});

module.exports = router;

//tiny.cloud/get-tiny/language-packages
