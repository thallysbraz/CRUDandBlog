//Arquivos de pacotes
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

//Importando arquivos de rotas
const categoriesController = require("./categories/CategoriesController"); // Arquivo de Categoria
const articlesController = require("./articles/ArticlesController"); // Arquivo de Artigo
const usersController = require("./users/UsersController"); // Arquivo de user

// Importando arquivos de Models
const Category = require("./categories/Category"); // Model de Categorias
const Article = require("./articles/Article"); // Model de artigos.
const User = require("./users/User"); // Model de usuários

// Import arquivo de config e criando conexão com o Banco de Dados
const connection = require("./database/database");
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados criada.");
  })
  .catch(error => {
    console.log("error ao conectar no banco: " + error);
  });

//configurações
const app = express();
const PORT = process.env.PORT || 3000;

//configurando view EJS
app.set("view engine", "ejs");

//Arquivos Static
app.use(express.static("public")); //reconhecendo arquivos estaticos

//Config Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //reconhecendo JSON

//configurando sessions
app.use(
  session({
    secret: "d31eea6de784321c97cd14231f7c617e",
    cookie: { maxAge: 1800000 } // cookie para referenciar a sessions || maxAge: tempo maximo da sessions
  })
);

// config de rotas
app.use("/categories", categoriesController); // Middleware das rotas de categorias
app.use("/articles", articlesController); // Middleware das rotas de artigos
app.use("/admin", usersController); // Middleware das rotas de usuário

//rotas

//rotas de teste session e leitura
app.get("/session", (req, res) => {
  req.session.treinamento = "Fromação NodeJS";
  req.session.ano = 2019;
  req.session.email = "thallysbraz3@gmail.com";
  req.session.user = {
    username: "thallys",
    email: "email@exemple.com",
    id: 10
  };
  res.send("Sessão gerada");
});

app.get("/leitura", (req, res) => {
  res.json({
    treinamento: req.session.treinamento,
    ano: req.session.ano,
    email: req.session.email,
    user: req.session.user
  });
});

//rota raiz
app.get("/", (req, res) => {
  //Pesquisando artigos
  Article.findAll({ order: [["id", "DESC"]], limit: 4 })
    .then(articles => {
      Category.findAll()
        .then(categories => {
          res.render("index", { articles: articles, categories: categories });
        })
        .catch(error => {
          res.status(404).json({
            msg: "Error ao listar artigos",
            error: error
          });
        });
    })
    .catch(error => {
      res.status(404).json({
        msg: "Error ao listar artigos",
        error: error
      });
    });
});

//exibir artigo por slug
app.get("/:slug", (req, res) => {
  var slug = req.params.slug;

  // Buscando artigo pelo slug
  Article.findOne({
    where: {
      slug: slug
    }
  })
    .then(article => {
      if (article != undefined) {
        Category.findAll()
          .then(categories => {
            res.render("article", { article: article, categories: categories });
          })
          .catch(error => {
            res.status(404).json({
              msg: "Error ao listar artigos",
              error: error
            });
          });
      } else {
        res.redirect("/");
      }
    })
    .catch(error => {
      res.status(404).json({
        msg: "Error ao listar artigo",
        error: error
      });
    });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;

  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  })
    .then(category => {
      if (category != undefined) {
        Category.findAll()
          .then(categories => {
            res.render("index", {
              articles: category.articles,
              categories: categories
            });
          })
          .catch(error => {
            res.status(404).json({
              msg: "Error ao buscar dados",
              error: error
            });
          });
      } else {
        res.redirect("/");
      }
    })
    .catch(error => {
      res.status(404).json({
        msg: "Error ao listar Categorias",
        error: error
      });
    });
});

//porta que o serve está rodando
app.listen(PORT, () => {
  try {
    console.log("server startado, na porta: " + PORT);
  } catch (e) {
    console.log("error: " + e);
  }
});
