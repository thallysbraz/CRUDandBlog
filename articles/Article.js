const Sequelize = require("sequelize");
const connection = require("../database/database"); // Importando conexão com o banco de dados

// Importando Model de category para fazer o relacionamento
const Category = require("../categories/Category");

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
//hasMany = Muitos || belongsTo = 1
Category.hasMany(Article); // Uma categoria tem muitos artigos.
Article.belongsTo(Category); // Artigo pertence a Categoria

module.exports = Article;
