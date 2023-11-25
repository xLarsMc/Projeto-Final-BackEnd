//Importações
const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const helpers = require('../helpers/helper');
const { validaToken, validaCriaUser } = require('../helpers/middlewares');

//Rota inicial
router.get('/', (req, res) => {
    res.status(200).json({msg: "Funcionando!"});
})

//Rota para registro de usuário
router.post('/registrar', validaCriaUser, async (req, res) => {
    const {nome, idade, email, senha} = req.body;
    try{
        const newUser = await helpers.newUser(nome, idade, email, senha);
        console.log(newUser)
        return res.status(200).json({msg: "Cadastrado", user: newUser});
    } catch(error){
        console.log(error);
        return res.status(500).json({msg: "Um erro aconteceu!"});
    }
})

//Rota para login
router.post('/login', async (req, res) => {
    const {email, senha} = req.body;
    try{
        const secret = process.env.SECRET;
        const token = jwt.sign({
            email: email
        }, secret)
        res.status(200).json({msg:"Autenticacao realizada com sucesso", token})
    } catch(error){
        console.log(error);
        return res.status(500).json({msg: "Token não foi criado"});
    }
})

//Rota para exclusão de usuário
router.delete('/delete/:email', validaToken, async(req, res) => {
    try{
        const delUser = await helpers.deleteUser(req.params.email)
        return res.status(200).json({msg: "Excluído com sucesso!", user: delUser});
    } catch(error){
        console.log(error);
        return res.status(500).json({msg: "Um erro aconteceu!"});
    }
})

//Rota para modificação de um usuário
router.put('/modifica/:email', async(req, res) => {
    const userModif = req.body;
    const email = req.params.email

    try{
        finalUser = await helpers.attUser(email, userModif);
        console.log(finalUser);
    } catch(error){
        console.log("vishh", error);
        return res.status(500).json({msg: "Um erro aconteceu"});
    }
    return res.status(200).json({msg: "Atualizado com sucesso!", user: finalUser});
})

//Rota para pesquisa de um usuário em específico
router.get("/busca/:email", async(req, res) => {
    const email = req.params.email;
    try{
        const user = await helpers.getUserByEmail(email);
        return res.status(200).json({msg: "Usuário encontrado", user: user});
    } catch(error){
        console.log(error);
        return res.status(404).json({msg: "User não encontrado"});
    }
})

//Rota para listagem dos usuários
router.get("/listagem", async(req, res) =>{
    const lista = await helpers.showAllUsers();
    return res.status(200).json({msg: "Lista de usuários!", lista:lista});
})

module.exports = router;