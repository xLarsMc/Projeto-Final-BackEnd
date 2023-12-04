const jwt = require('jsonwebtoken');
const {userModel, userProfileModel, postModel} = require("../model/models");

module.exports = {
    //Função geral
    getEmailByAuthHeader: (authHeader) => {
        const token = authHeader && authHeader.split(' ')[1];
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        return decoded.email;
    },
    //Função para usuários
    newUser: async (nome, idade, email, senha) => {
        const user = await userModel.create({nome, idade, email, senha});
        return user;
    },
    attUser: async(email, user) => {
        return await userModel.updateOne({email: email}, {$set: user});
    },
    deleteUser: async(email) => {
        return await userModel.deleteOne({
            email: email
        })
    },
    getUserByEmail: async(email) => {
        return await userModel.findOne({email:email})
    },
    showAllUsers: async() =>{
        return await userModel.find();
    },
    showSomeUsers: async(limite, pagina) => {
        const qtyIgnore = limite*(pagina-1);
        const list = await userModel.find();
        const filteredList = list.slice(qtyIgnore,limite*pagina);
        console.log(filteredList.length);
        return filteredList;
    },
    //Função para posts
    newPost: async (autor, titulo, descricao) => {
        const post = await postModel.create({autor, titulo, descricao});
        return post;
    },
    attPost: async(titulo, post) => {
        return await postModel.updateOne({titulo: titulo}, {$set: post});
    },
    deletePost: async(autor, titulo) => {
        return await postModel.deleteOne({
            autor: autor,
            titulo: titulo
        })
    },
    getUserPost: async(autor, titulo) => {
        return await postModel.findOne({autor: autor, titulo: titulo})
    },
    getUserAllPost: async(autor) => {
        return await postModel.find({autor:autor})
    }
}