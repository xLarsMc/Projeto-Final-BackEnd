const mongoose = require('mongoose');
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster.sagykcg.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
    console.log("Conectou!");
}).catch((err) => console.log(err))

module.exports = mongoose