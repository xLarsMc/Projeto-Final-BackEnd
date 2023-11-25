const {userModel, comentModel, postModel} = require("../model/models");

module.exports = {
    newUser: async (nome, idade, email, senha) => {
        const user = await userModel.create({nome, idade, email, senha});
        return user;
    }
}