const express = require("express");
const bodyParser = require("body-parser");

//Importando arquivos de rotas
const categoriesController = require("./categories/CategoriesController"); // Arquivo de Categoria
const articlesController = require("./articles/ArticlesController"); // Arquivo de Artigo

// Importando arquivos de Models
const Category = require("./categories/Category"); // Model de Categorias
const Article = require("./articles/Article"); // Model de artigos.

// Import arquivo de config e criando conexão com o Banco de Dados
const connection = require("./database/database");

connection
  .authenticate()
  .then(() => {
    console.log("conexão com banco de dados criada.");
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

//rotas
//rota raiz
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/categories", categoriesController); // Middleware de rotas de categorias
app.use("/articles", articlesController); // Middleware de rotas de artigos
//porta que o serve está rodando
app.listen(PORT, () => {
  try {
    console.log("server startado, na porta: " + PORT);
  } catch (e) {
    console.log("error: " + e);
  }
});
