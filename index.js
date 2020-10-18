const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const connection = require("./database/database")
const modelPergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta") 
//Database

connection
    .authenticate()
    .then(() => {
        console.log('Banco conectado !');
    })
    .catch((erro) =>{
        console.log(erro);
    })

//indicando ao express que deve ser usada a view engine EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))

//BodyParser utilizando para capturar os dados do formulário
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rotas do meu servidor
app.get("/", (req, res) =>{
    modelPergunta.findAll({raw: true, order: [
        ['id', 'DESC' ]
    ]}).then(perguntas =>{
        res.render('index', {
            perguntas: perguntas
        })
    })
    
})

app.get("/perguntar",(req,res) =>{
    res.render('perguntar')
})

//Passando os dados capturados pelo BodyParser
app.post("/dados",(req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    modelPergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    })
})

app.get("/perguntar/:id", (req,res) =>{
    var id = req.params.id
    modelPergunta.findOne({
        where: {id:id}
    }).then(pergunta =>{
        if(pergunta != undefined){// Encontrou

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        }else{ //Não encontrou 
            res.redirect("/")
        }
    })
})

app.post("/respostas",(req, res)=>{
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect(`/perguntar/${perguntaId}`)
    })
})

app.listen(8080, ()=>{console.log("Está funcionando !!");})