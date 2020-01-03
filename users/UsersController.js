const express = require("express");

//Model de User
const User = require("./User");

const router = express.Router();

//rota pra listar os usuários
router.get("/users", (req, res) => {
  res.send("User list");
});

//rota para view de adicionar usuários
router.get("/users/create", (req, res) => {
  res.render("admin/users/create");
});

module.exports = router;
