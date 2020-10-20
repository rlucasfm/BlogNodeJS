if(process.env.NODE_ENV == "production"){
    // Senha Tll0xtEcWL7l88Gh
    module.exports = {mongoURI: "mongodb+srv://richard:Tll0xtEcWL7l88Gh@cluster0.unqwq.mongodb.net/Cluster0?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}