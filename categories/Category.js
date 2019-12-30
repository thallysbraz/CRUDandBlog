const Sequelize = require("sequelize");
const connection = require("../database/database"); // Importando conexão com o banco de dados

const Category = connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Category;
