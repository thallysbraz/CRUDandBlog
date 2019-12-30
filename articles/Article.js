const Sequelize = require("sequelize");
const connection = require("../database/database"); // Importando conexão com o banco de dados

const Article = connection.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

module.exports = Article;
