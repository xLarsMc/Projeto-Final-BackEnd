const jwt = require('jsonwebtoken');
const helpers = require('../helpers/helper');
require('dotenv').config();

function validaToken(req, res, next){
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

async function validaCriaUser(req, res, next){
    const {nome, idade, email, senha} = req.body
    const user = await helpers.getUserByEmail(email);

    if(user){
        return res.status(422).json({msg: "Usuário com esse email já existe. Utilize outro email"});
    }
    if(!nome || nome.length < 3){
        return res.status(422).json({msg: "Nome não fornecido ou tamanho menor que 3"});
    }
    if(email.includes("@admin")){
        return res.status(422).json({msg: "Você não pode criar um usuário administrador"});
    }
    if(!idade || idade < 18){
        return res.status(422).json({msg: "Idade não informada ou insuficiente para a plataforma"});
    }
    if(!email || !email.includes("@gmail.com")){
        return res.status(422).json({msg: "Email não informado ou inválido (email deve ser no formato email@gmail.com para usuarios e email@admin.com para administradores"});
    }
    if(!senha || senha.length < 8){
        return res.status(422).json({msg: "Senha não informada ou menor qu 8 caracteres"})
    }
    next();
}

async function checkPassEmail (req, res, next){
    const user = await helpers.getUserByEmail(email);
    if(!user){
        return res.status(422).json({msg: "Usuário não existe"});
    }
    if(user.senha != senha){
        return res.status(422).json({msg: "Senha inválida"});
    }
}
async function isAdmin(req, res, next){
    const {email} = req.body;
    if(!email.includes("@admin")){
        return res.status(422).json({msg: "Você não é um administrador para fazer isso!"});
    }
    next();
}


module.exports = {
    validaToken,
    validaCriaUser,
    isAdmin,
    checkPassEmail
}