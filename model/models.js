const mongoose = require('mongoose');

const user = new mongoose.Schema({
    nome: String,
    idade: Number,
    email: String,
    senha: String,
})

const userProfile = new mongoose.Schema({
    autor: {type: user, ref: 'user.email'},
    bio: String,
    profilePicture: String
});

const post = new mongoose.Schema({
    autor: {type: user, ref: 'user.email'},
    titulo: String,
    descricao: String
})

const userModel = mongoose.model("user", user);
const userProfileModel = mongoose.model("profile", userProfile);
const postModel = mongoose.model("post", post);

module.exports = {
    userModel,
    userProfileModel,
    postModel
}