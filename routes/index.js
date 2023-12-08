//Importações
const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const helpers = require('../helpers/helper');
const { validaToken, validaCriaUser, isAdmin, checkPassEmail, validaCriaAdmin } = require('../helpers/middlewares');
const { restart } = require('nodemon');

//Rota inicial
router.get('/', (req, res) => {
    res.status(200).json({ msg: "Funcionando!" });
})

//Rota para registro de usuário
router.post('/registrar', validaCriaUser, async (req, res) => {
    const { nome, idade, email, senha } = req.body;
    try {
        const newUser = await helpers.newUser(nome, idade, email, senha);
        console.log(newUser)
        return res.status(200).json({ msg: "Cadastrado", user: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Um erro aconteceu!" });
    }
})

//Rota para registro de um admin
router.post('/registrarAdmin', validaToken, isAdmin, validaCriaAdmin, async (req, res) => {
    const { nome, idade, email, senha } = req.body;
    try {
        const newUser = await helpers.newUser(nome, idade, email, senha);
        console.log(newUser)
        return res.status(200).json({ msg: "Cadastrado", user: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Um erro aconteceu!" });
    }
})

//Rota para login
router.post('/login', checkPassEmail, async (req, res) => {
    const { email } = req.body;
    try {
        const secret = process.env.SECRET;
        if (email.includes("@admin")) {
            let token = jwt.sign({
                email: email,
                isAdmin: true
            }, secret)
            res.status(200).json({ msg: "Autenticacao realizada com sucesso - admin", token })
        } else {
            const token = jwt.sign({
                email: email
            }, secret)
            res.status(200).json({ msg: "Autenticacao realizada com sucesso", token })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Token não foi criado" });
    }
})

//Rota para exclusão de usuário qualquer
router.delete('/delete/:email', validaToken, isAdmin, async (req, res) => {
    try {
        const delUser = await helpers.deleteUser(req.params.email)
        return res.status(200).json({ msg: "Excluído com sucesso!", user: delUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Um erro aconteceu!" });
    }
})
//Rota para exclusão do própio usuário
router.delete('/deleteMyself', validaToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const email = helpers.getEmailByAuthHeader(authHeader);

    const user = await helpers.deleteUser(email);

    return res.status(200).json({ msg: "Excluído com sucesso!", user: user });

})

//Rota para modificação de um usuário qualquer
router.put('/modifica/:email', validaToken, isAdmin, async (req, res) => {
    const userModif = req.body;
    const email = req.params.email
    try {
        finalUser = await helpers.attUser(email, userModif);
        console.log(finalUser);
    } catch (error) {
        console.log("vishh", error);
        return res.status(500).json({ msg: "Um erro aconteceu" });
    }
    return res.status(200).json({ msg: "Atualizado com sucesso!", user: finalUser });
})

//Rota para modificação do própio usuário
router.put('/modificaMyself', validaToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const email = helpers.getEmailByAuthHeader(authHeader);
    const userModif = req.body;

    if (req.body.nome && req.body.nome.length < 3) {
        return res.status(422).json({ msg: "Nome com tamanho menor que 3" });
    }
    if (req.body.email && !req.body.email.includes("@gmail.com")) {
        return res.status(422).json({ msg: "O seu usuário deve ter ter a estrutura: nome@gmail.com" });
    }
    if (req.body.email.includes("@admin")) {
        return res.status(422).json({ msg: "Você não pode criar um usuário administrador" });
    }
    if (req.body.idade && req.body.idade < 18) {
        return res.status(422).json({ msg: "Idade insuficiente para a plataforma" });
    }
    if (req.body.senha && req.body.senha.length < 8) {
        return res.status(422).json({ msg: "Senha menor que 8 caracteres" })
    }

    const user = await helpers.attUser(email, userModif);

    return res.status(200).json({ msg: "Atualizado com sucesso!", user: user });

})

//Rota para pesquisa de um usuário em específico
router.get("/busca/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const user = await helpers.getUserByEmail(email);
        return res.status(200).json({ msg: "Usuário encontrado", user: user });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: "User não encontrado" });
    }
})

//Rota para listagem dos usuários
router.get("/listagem", async (req, res) => {
    const lista = await helpers.showAllUsers();
    return res.status(200).json({ msg: "Lista de usuários!", lista: lista });
})

//Rota para listagem de usuários específicas (baseados em limite e paginação)
router.get('/listagem/:limite/:pagina', async (req, res) => {
    const lista = await helpers.showSomeUsers(req.params.limite, req.params.pagina);
    return res.status(200).json({ msg: "Lista de usuários!", lista: lista });
})

//CRUD para o post
router.post('/adicionaPost', validaToken, async (req, res,) => {
    const authHeader = req.headers['authorization'];
    const email = await helpers.getEmailByAuthHeader(authHeader);
    const user = await helpers.getUserByEmail(email);
    const { titulo, descricao } = req.body;
    const existPost = await helpers.getUserPost(user, titulo)
    if (existPost != null) {
        return res.status(422).json({ msg: "Você já possuí um post com esse título", post: existPost });
    }
    const newPost = await helpers.newPost(user, titulo, descricao)
    console.log(existPost)
    return res.status(200).json({ msg: "Post criado com sucesso", newPost })
})

router.put('/modificaPost/:titulo', validaToken, async(req, res)=> {
    const authHeader = req.headers['authorization'];
    const email = await helpers.getEmailByAuthHeader(authHeader);
    const user = await helpers.getUserByEmail(email);
    const postModif = req.body;
    const existPost = await helpers.getUserPost(user, req.params.titulo)
    if (existPost == null) {
        return res.status(422).json({ msg: "Você Não possuí um post com esse título para modificalo", post: existPost });
    }
    const modifPost = await helpers.attPost(existPost.titulo,postModif)
    return res.status(200).json({msg: "Post atualizado com sucesso", post:modifPost})
})

router.delete('/deletePost/:titulo', validaToken, async(req, res) => {
    const authHeader = req.headers['authorization'];
    const email = await helpers.getEmailByAuthHeader(authHeader);
    const user = await helpers.getUserByEmail(email);
    const existPost = await helpers.getUserPost(user, req.params.titulo)
    if (existPost == null) {
        return res.status(422).json({ msg: "Você Não possuí um post com esse título excluir", post: existPost });
    }

    const deletePost = await helpers.deletePost(user, existPost.titulo)
    return res.status(200).json({msg: "Post excluído!", post: deletePost})
})

router.get('/buscaPost/:titulo', validaToken, async(req, res) => {
    const authHeader = req.headers['authorization'];
    if(req.query.email){
        var user = await helpers.getUserByEmail(req.query.email);
    } else{
        const email = await helpers.getEmailByAuthHeader(authHeader);
        var user = await helpers.getUserByEmail(email);
    }
    const existPost = await helpers.getUserPost(user, req.params.titulo)
    console.log(req.params.titulo)
    if (existPost == null) {
        return res.status(422).json({ msg: "Você Não possuí um post com esse título. Lembre-se que o titulo deve estar igual, com letras maiúsculas e espaços.", post: existPost });
    }
    return res.status(200).json({msg: "Post encontrado!", post: existPost})
})

router.get('/todosPost', validaToken, async(req, res) => {
    const authHeader = req.headers['authorization'];
    if(req.query.email){
        var user = await helpers.getUserByEmail(req.query.email);
    } else{
        const email = await helpers.getEmailByAuthHeader(authHeader);
        var user = await helpers.getUserByEmail(email);
    }
    const existPostList = await helpers.getUserAllPost(user)
    if (!existPostList) {
        return res.status(422).json({ msg: "Você Não possuí um posts.", post: existPostList });
    }
    return res.status(200).json({msg: "Posts encontrado!", post: existPostList})
})
//CRUD para o userProfile
router.post('/adicionaProfile', validaToken, async (req, res,) => {
    const authHeader = req.headers['authorization'];
    const email = await helpers.getEmailByAuthHeader(authHeader);
    const user = await helpers.getUserByEmail(email);
    const { bio, profilePicture } = req.body;
    const existProfile = await helpers.getUserProfile(user)
    console.log(existProfile)
    if (existProfile != null) {
        return res.status(422).json({ msg: "Você já possuí um perfil. Você podê modificá-lo.", existProfile });
    }
    const newProfile = await helpers.newProfile(user, bio, profilePicture)
    //console.log(newProfile)
    return res.status(200).json({ msg: "Perfil criado com sucesso", newProfile })
})

router.put('/modificaProfile', validaToken, async(req, res)=> {
    const authHeader = req.headers['authorization'];
    const email = await helpers.getEmailByAuthHeader(authHeader);
    const user = await helpers.getUserByEmail(email);
    const profileModif = req.body;
    const existProfile = await helpers.getUserProfile(user)
    if (existProfile == null) {
        return res.status(422).json({ msg: "Você Não possuí um profile para modificalo", existProfile });
    }
    const modifProfile = await helpers.attProfile(user, profileModif)
    return res.status(200).json({msg: "Profile atualizado com sucesso", modifProfile})
})

router.delete('/deleteProfile', validaToken, async(req, res) => {
    const authHeader = req.headers['authorization'];
    const email = await helpers.getEmailByAuthHeader(authHeader);
    const user = await helpers.getUserByEmail(email);
    const existProfile = await helpers.getUserProfile(user)
    if (existProfile == null) {
        return res.status(422).json({ msg: "Você Não possuí um profile para excluir", existProfile});
    }

    const deleteProfile = await helpers.deleteProfile(user)
    return res.status(200).json({msg: "Profile excluído!", deleteProfile})
})


module.exports = router;