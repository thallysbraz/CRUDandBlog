const Sequelize = require("sequelize");
const connection = require("../database/database"); // Importando conexão com o banco de dados

const User = connection.define("users", {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;
