// Carregando módulos necessários. Neste projeto usaremos:
// Express, Handlebars, Body Parser e o Mongoose (Sequelize caso utilizar MySQL)
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const usuarios = require("./routes/usuarios")
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const passport = require("passport")
    require("./config/auth")(passport)
    const db = require("./config/db")

// Configurações
    // Configuração da sessão
        app.use(session({
            secret: "codigobacanaedificil",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    // Middleware para as sessões
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
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
        mongoose.connect(db.mongoURI, {
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
    app.use('/usuarios', usuarios)

    app.get("/", (req,res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as postagens")
            res.redirect("/404")
        })
    })

    app.get("/404", (req,res) => {
        res.send("Erro 404")
    })

    app.get("/postagem/:slug", (req,res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }     
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/categorias", (req,res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req,res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts dessa categoria")
                    res.redirect("/") 
                })
            }else{
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/") 
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao abrir a página desta categoria")
            res.redirect("/")
        })
    })
    
// Abertura do LISTEN
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log("Servidor aberto com sucesso.")
})