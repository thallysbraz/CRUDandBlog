const express = require("express");
const bodyParser = require("body-parser");

// Import arquivo de conexão do banco
const connection = require("./database/database");

//conexão com banco de dados
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
app.set("view engine", "ejs"); // configurando view

//Arquivos Static
app.use(express.static("public")); //reconhecendo arquivos estaticos

//Config Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
//rota raiz
app.get("/", (req, res) => {
  res.render("index");
});

//porta que o serve está rodando
app.listen(PORT, () => {
  try {
    console.log("server startado, na porta: " + PORT);
  } catch (e) {
    console.log("error: " + e);
  }
});
