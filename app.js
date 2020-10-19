// Carregando módulos necessários. Neste projeto usaremos:
// Express, Handlebars, Body Parser e o Mongoose (Sequelize caso utilizar MySQL)
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require('path')
    const mongoose = require('mongoose')

// Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Conectado ao MongoDB.")
        }).catch((err) => {
            console.log("Houve um erro ao conectar: "+err)
        })
    // Arquivos estáticos
        app.use(express.static(path.join(__dirname,"public")))

// Rotas
    app.use('/admin', admin)
    
// Abertura do LISTEN
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor aberto com sucesso.")
})