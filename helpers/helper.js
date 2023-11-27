const {userModel, comentModel, postModel} = require("../model/models");

module.exports = {
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
        console.log(filteredList);
        return filteredList;
    }
}