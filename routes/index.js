//Importações
const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const helpers = require('../helpers/helper');
const { validaToken, validaCriaUser, isAdmin, checkPassEmail, validaCriaAdmin } = require('../helpers/middlewares');

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

//Rota para registro de um admin
router.post('/registrarAdmin', validaToken, isAdmin, validaCriaAdmin, async (req, res) => {
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
router.post('/login', checkPassEmail, async (req, res) => {
    const {email} = req.body;
    try{
        const secret = process.env.SECRET;
        if(email.includes("@admin")){
            let token = jwt.sign({
                email:email,
                isAdmin: true
            }, secret)
            res.status(200).json({msg:"Autenticacao realizada com sucesso - admin", token})
        } else{
            const token = jwt.sign({
                email: email
            }, secret)
            res.status(200).json({msg:"Autenticacao realizada com sucesso", token})
        }
    }catch (error){
        console.log(error);
        return res.status(500).json({msg: "Token não foi criado"});
    }
})

//Rota para exclusão de usuário qualquer
router.delete('/delete/:email', validaToken, isAdmin, async(req, res) => {
    try{
        const delUser = await helpers.deleteUser(req.params.email)
        return res.status(200).json({msg: "Excluído com sucesso!", user: delUser});
    } catch(error){
        console.log(error);
        return res.status(500).json({msg: "Um erro aconteceu!"});
    }
})
//Rota para exclusão do própio usuário
router.delete('/deleteMyself', validaToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;
        
    const user = await helpers.deleteUser(email);

    return res.status(200).json({msg: "Excluído com sucesso!", user: user});

})

//Rota para modificação de um usuário qualquer
router.put('/modifica/:email', validaToken, isAdmin, async(req, res) => {
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

//Rota para modificação do própio usuário
router.put('/modificaMyself', validaToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;
    const userModif = req.body;

    if(req.body.nome && req.body.nome.length < 3){
        return res.status(422).json({msg: "Nome com tamanho menor que 3"});
    }
    if(req.body.email && !req.body.email.includes("@gmail.com")){
        return res.status(422).json({msg: "O seu usuário deve ter ter a estrutura: nome@gmail.com"});
    }
    if(req.body.email.includes("@admin")){
        return res.status(422).json({msg: "Você não pode criar um usuário administrador"});
    }
    if(req.body.idade && req.body.idade < 18){
        return res.status(422).json({msg: "Idade insuficiente para a plataforma"});
    }
    if(req.body.senha && req.body.senha.length < 8){
        return res.status(422).json({msg: "Senha menor que 8 caracteres"})
    }

    const user = await helpers.attUser(email, userModif);

    return res.status(200).json({msg: "Atualizado com sucesso!", user: user});

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