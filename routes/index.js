//Importações
const express = require('express');
var router = express.Router();

//Rota inicial
router.get('/', (req, res) => {
    res.status(200).json({msg: "Funcionando!"});
})

module.exports = router;