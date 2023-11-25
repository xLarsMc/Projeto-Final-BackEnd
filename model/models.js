const mongoose = require('mongoose');

const user = new mongoose.Schema({
    nome: String,
    idade: Number,
    email: String,
    senha: String,
})

const comentarios = new mongoose.Schema({
    autor: user,
    conteudo: String
})

const post = new mongoose.Schema({
    autor: user,
    titulo: String,
    comentarios: [comentarios],
})

const userModel = mongoose.model("user", user);
const comentModel = mongoose.model("comment", comentarios);
const postModel = mongoose.model("post", post);

module.exports = {
    userModel,
    comentModel,
    postModel
}