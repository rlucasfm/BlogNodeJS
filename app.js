// Carregando módulos necessários. Neste projeto usaremos:
// Express, Handlebars, Body Parser e o Mongoose (Sequelize caso utilizar MySQL)
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

// Configurações
    // Configuração da sessão
        app.use(session({
            secret: "codigobacanaedificil",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware para as sessões
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
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