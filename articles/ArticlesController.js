const express = require("express");
const slugify = require("slugify");

const router = express.Router();

//Carregando Models
const Category = require("../categories/Category"); // Categoria
const Article = require("./Article"); // Artigo

//rotas
router.get("/admin", (req, res) => {
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

//rota para salvar artigo no BD
router.post("/save", (req, res) => {
  //recebendo dados(titulo, categoria e body) do form
  var { title, category, body } = req.body;
  //fazendo verificações antes de salvar dado no Banco
  if (title != undefined && category != undefined && body != undefined) {
    //verificando se ID da categoria informada e número valido
    if (!isNaN(category)) {
      // se for número, cria artigo no BD
      Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
      })
        .then(() => {
          res.redirect("/articles/admin");
        })
        .catch(error => {
          // se der erro interno, mostra json ao usuário com o erro.
          res.status(404).json({
            msg: "Error interno ao atualizar categoria",
            error: error
          });
        });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

module.exports = router;

//tiny.cloud/get-tiny/language-packages
