const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const {v4: uuidv4} = require('uuid')

const app = express()
const server = http.createServer(app)
const sockets = socketIO(server, {
    maxHttpBufferSize: 10 * 1024 * 1024, // Define o tamanho máximo do payload para 10MB
})

const port = 3000


app.use(express.static('chat'))

//
const pessoas = {}
const mensagens = []
//

//login
app.get('/', (req, res) => {
    res.redirect('/login')
})
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/chat/index.html')
})


app.use(express.json())

app.post('/login', (req, res) => {
    const er = /assent\/avatar\/avatar[1-4].png/
    req.body.avatar = req.body.avatar.match(er)[0]
    req.body.id = uuidv4()
    pessoas[req.body.id] = req.body

    res.redirect('/chat?id=' + req.body.id)
})

function verificacao(req,res,next) {
    const url = req.url
    const regex = /[?&]id=([^&#]*)/i
    const match = regex.exec(url)
    const id = match && match[1]

    if (pessoas[id])
        next()
    else 
        res.redirect('/login')
}


//

app.get('/chat',verificacao, (req, res) => {
    res.sendFile(__dirname + '/chat/chat.html')
})



sockets.on('connection', (socket) => {
    //console.log(socket.id)


    socket.on('identificacao', (id) => {
        if (pessoas[id]) {
            pessoas[id].socketID = socket.id
        }
        console.log(pessoas)
        
        socket.emit('pessoas conectadas', pessoas)

        socket.broadcast.emit('adicionar usuario', pessoas[id])

        for (let i in mensagens) {
            if (mensagens[i].tipo == 'texto') {
                socket.emit('mensagem texto', mensagens[i])
            } else {
                socket.emit('mensagem img', mensagens[i])
            }
        }
    })

    socket.on('curtir', id => {
        if (!pessoas[id].curtidas)
            pessoas[id].curtidas = 0

        pessoas[id].curtidas = pessoas[id].curtidas + 1
        sockets.emit('curtir', {id, curtidas:pessoas[id].curtidas})
    })

    socket.on('enviar mensagem', ({id , mensagem, tipo}) => {
        if (tipo === 'texto') {
            sockets.emit('mensagem texto', {
                nome: pessoas[id].nome,
                texto: mensagem,
                id: id
            })
            mensagens.push({
                id,
                texto: mensagem,
                tipo,
                nome: pessoas[id].nome
            })
        } else {
            //como salvar a imagem no diretorio assent/imagens
            const img = `data:${mensagem.img.tipo};base64,${mensagem.img.string}`
            // e como referenciar ela para o navegador
            sockets.emit('mensagem img', {
                nome: pessoas[id].nome,
                texto: mensagem.texto,
                img: img,
                id: id
            })
            mensagens.push({
                id,
                texto: mensagem.texto,
                img: img,
                tipo,
                nome: pessoas[id].nome
            })
        }
        
        if (mensagens.length > 60) {
            for (let i = 0; i < 10; i++) 
                mensagens.shift()
        }
    })

    socket.on('disconnect', () => {
        for (let i in pessoas) {
            if (pessoas[i].socketID === socket.id) {
                console.log(pessoas[i] + 'excluido')
                delete pessoas[i]
                sockets.emit('remover usuario', i)
            }
        }
    })
})


server.listen(port, () => {
    console.log(`servidor rodando em http://localhost:${port}`)
})