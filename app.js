//Importações e configurações
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const rotas = require('./routes/index');
const mongoose = require('./model/bd');
require('dotenv').config();

//Leitura de JSON
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Ligando o servidor
app.listen(process.env.PORT);
console.log("ouvindo na porta " + process.env.PORT);

//Rotas serão acessadas por:
app.use("/api", rotas);

module.exports = app;

