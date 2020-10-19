// Carregando módulos necessários. Neste projeto usaremos:
// Express, Handlebars, Body Parser e o Mongoose (Sequelize caso utilizar MySQL)
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    //const mongoose = require('mongoose')

// Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')

// Rotas
    
// Abertura do LISTEN
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor aberto com sucesso.")
})