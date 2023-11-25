//Importações
const express = require('express');
var router = express.Router();
const helpers = require('../helpers/helper');

//Rota inicial
router.get('/', (req, res) => {
    res.status(200).json({msg: "Funcionando!"});
})

router.post('/registrar', async (req, res) => {
    const {nome, idade, email, senha} = req.body;
    try{
        const newUser = await helpers.newUser(nome, idade, email, senha);
        console.log(newUser)
        return res.status(200).json({msg: "Cadastrado", user: newUser});
    } catch(error){
        console.log(error);
        return res.status(500).json({msg: "Um erro aconteceu"});
    }
})
module.exports = router;