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
        res.redirect("/categories/admin/categories");
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
  Category.findAll()
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

//rota para deletar categoria do Banco de Dados
router.post("/admin/delete", (req, res) => {
  console.log("chegou aqui");
  const id = req.body.id;
  console.log("id: " + id);
  //verificando se id está definido
  if (id != undefined) {
    //verificando se o ID informado, e um numero
    if (!isNaN(id)) {
      //Deletando categoria
      Category.destroy({
        where: {
          id: id
        }
      })
        .then(() => {
          // se excluir corretamente redireciona
          res.redirect("/categories/admin/categories");
        })
        .catch(error => {
          // se der erro interno, mostra json ao usuário com o erro.
          res.status(404).json({
            msg: "Error interno ao excluir categoria",
            error: error
          });
        });
    } else {
      // Se ID não for número, redireciona
      res.redirect("/categories/admin/categories");
    }
  } else {
    //Se ID for null, redireciona
    res.redirect("/categories/admin/categories");
  }
});

//rota para view de atualizar categoria
router.get("/admin/categories/edit/:id", (req, res) => {
  var id = req.params.id;

  if (id != undefined) {
    if (isNaN(id)) {
      //se id nao for numero redireciona
      res.redirect("/categories/admin/categories");
    } else {
      Category.findByPk(id)
        .then(category => {
          if (category != undefined) {
            res.render("admin/categories/edit", {
              category: category
            });
          } else {
            res.redirect("/categories/admin/categories");
          }
        })
        .catch(error => {
          // se der erro interno, mostra json ao usuário com o erro.
          res.status(404).json({
            msg: "Error interno ao atualizar categoria",
            error: error
          });
        });
    }
  } else {
    //Se o ID for null
    res.redirect("/categories/admin/categories");
  }
});

router.post("categories/update", (req, res) => {
  const title = req.body.title; // recebendo novo titulo do form
  //verificando se titulo não e nulo
  if (title != undefined) {
  } else {
    res.redirect("/categories/admin/categories");
  }
});

module.exports = router;
