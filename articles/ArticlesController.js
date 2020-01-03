const express = require("express");
const slugify = require("slugify");

const router = express.Router();

//Carregando Models
const Category = require("../categories/Category"); // Categoria
const Article = require("./Article"); // Artigo

//rotas para listar artigos
router.get("/admin", (req, res) => {
  /* 
  Buscando artigos no banco e incluindo model de Category para fazer join entre artigos e categorias para exibir a qual categoria cada artigo pertence no front
  */
  Article.findAll({
    include: [{ model: Category }]
  })
    .then(articles => {
      //render view com os artigos encontrados
      res.render("admin/articles/index", {
        articles: articles
      });
    })
    .catch(error => {
      res.status(404).json({
        msg: "Error ao listar artigos",
        error: error
      });
    });
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

//rota para deletar artigo do Banco de Dados
router.post("/admin/delete", (req, res) => {
  const id = req.body.id;
  //verificando se id está definido
  if (id != undefined) {
    //verificando se o ID informado, e um numero
    if (!isNaN(id)) {
      //Deletando categoria
      Article.destroy({
        where: {
          id: id
        }
      })
        .then(() => {
          // se excluir corretamente redireciona
          res.redirect("/articles/admin");
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
      res.redirect("/articles/admin");
    }
  } else {
    //Se ID for null, redireciona
    res.redirect("/articles/admin");
  }
});

//rota para view de atualizar artigo
router.get("/admin/edit/:id", (req, res) => {
  var id = req.params.id;

  if (id != undefined) {
    if (isNaN(id)) {
      //se id nao for numero redireciona
      res.redirect("/articles/admin");
    } else {
      Category.findAll()
        .then(categories => {
          Article.findByPk(id, {
            include: [{ model: Category }]
          })
            .then(article => {
              if (article != undefined) {
                res.render("admin/articles/edit", {
                  article: article,
                  categories: categories
                });
              } else {
                res.redirect("/articles/admin");
              }
            })
            .catch(error => {
              // se der erro interno, mostra json ao usuário com o erro.
              res.status(404).json({
                msg: "Error interno ao renderizar view de atualizar categoria",
                error: error
              });
            });
        })
        .catch(error => {
          res.status(404).json({
            msg: "Error ao buscar categorias, por favor",
            error: error
          });
        });
    }
  } else {
    //Se o ID for null
    res.redirect("/articles/admin");
  }
});

//rota para salvar update de artigo
router.post("/admin/update", (req, res) => {
  var { title, id, category, body } = req.body; //recebendo dados do form

  //verificando se dados do form não são nulos
  if (
    title != undefined &&
    id != undefined &&
    category != undefined &&
    body != undefined
  ) {
    //verificando se ID informado é número
    if (!isNaN(id)) {
      // se for número, atualiza o title e slug pelo ID da categoria no BD
      Article.update(
        {
          title: title,
          slug: slugify(title),
          body: body,
          categoryId: category
        },
        { where: { id: id } }
      )
        .then(() => {
          res.redirect("/articles/admin");
        })
        .catch(error => {
          // se der erro interno, mostra json ao usuário com o erro.
          res.status(404).json({
            msg: "Error interno ao atualizar artigo",
            error: error
          });
        });
    } else {
      // se NÃO for número, redirec para view de listar os artigos
      res.redirect("/articles/admin");
    }
  } else {
    //Se dados do form forem nulo, redirec para view de listar os artigos
    res.redirect("/articles/admin");
  }
});

//rota de paginação
router.get("/pages/:num", (req, res) => {
  var page = req.params.num;
  var offset = 0;
  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = parseInt(page) * 4 - 4;
  }

  Article.findAndCountAll({
    limit: 4, // numero maximo de dados que o banco retorna
    offset: offset, // Retorna dados a partir de:
    order: [["id", "DESC"]]
  })
    .then(articles => {
      var next;
      if (offset + 4 >= articles.count) {
        next = false;
      } else {
        next = true;
      }

      var result = {
        page: parseInt(page),
        next: next,
        articles: articles
      };

      Category.findAll()
        .then(categories => {
          res.render("admin/articles/page", {
            result: result,
            categories: categories
          });
        })
        .catch(error => {
          // se der erro interno, mostra json ao usuário com o erro.
          res.status(404).json({
            msg: "Error interno",
            error: error
          });
        });
    })
    .catch(error => {
      // se der erro interno, mostra json ao usuário com o erro.
      res.status(404).json({
        msg: "Error interno ao atualizar artigo",
        error: error
      });
    });
});

module.exports = router;

//tiny.cloud/get-tiny/language-packages
/*
IF no EJS

 <% if() { %>

            <% } else { %>

            <% } %>
*/
