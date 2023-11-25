const jwt = require('jsonwebtoken');
require('dotenv').config();

async function validaToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({msg: "Acesso negado"})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next();
    } catch(error){
        console.log(error);
        res.status(400).json({msg :"Senha inválida"})
    }
}

module.exports = {
    validaToken
}