function mainUserDiv({nome, avatar, curtidas=0}) {
    const userNome = document.querySelectorAll(".userNome")
    const userAvatar = document.querySelectorAll(".userAvatar")
    const userCurtidas = document.querySelectorAll(".userCurtidas")

    for (const element of userNome) {
        element.textContent = nome
    }

    for (const element of userAvatar) {
        element.src = avatar
    }

    for (const element of userCurtidas) {
        element.textContent = curtidas
    }
    
    /*
    userNome.forEach(element => {
        element.textContent = nome
    }); 

     userAvatar.forEach(element => {
        element.textContent = avatar
    }); 

     userCurtidas.forEach(element => {
        element.textContent = curtidas
    });
    */
}

function userDiv({nome, avatar, id, curtidas=0}) {
    const div = `
        <div class="main-usuarios-user" id="id${id}">
            <img src="${avatar}" alt="">
            <p>${nome}</p>
            <div class="curtida sem">
                <ion-icon name="heart-outline" class="nocurti"></ion-icon>
                <ion-icon name="heart" class="curti"></ion-icon>
                <p>${curtidas}</p>
            </div>
        </div>`

    const usersList = document.querySelector('#usuarios')

    usersList.innerHTML += div  
}

function suaMSGtexto({nome, texto}) {
    const msg = `
        <div class="main-conversa-mensagens-mensagem seu text">
            <p class="nome">${nome}</p>
            <p class="mensagem">${texto}</p>
        </div>`

    conversa.innerHTML += msg
}

function minhaMSGtexto({nome, texto}) {
    const msg = `
        <div class="main-conversa-mensagens-mensagem meu text">
            <p class="nome">${nome}</p>
            <p class="mensagem">${texto}</p>
        </div>`

    conversa.innerHTML += msg
}

function suaMSGfoto({nome,texto, img}) {
    const msg = `
    <div class="main-conversa-mensagens-mensagem seu img">
        <p class="nome">${nome}</p>
        <img class="img" src="${img}" alt="">
        <p class="mensagem">${texto}</p>
    </div>`

    conversa.innerHTML += msg
}

function minhaMSGfoto({nome, texto, img}) {
    const msg = `
    <div class="main-conversa-mensagens-mensagem meu img">
        <p class="nome">${nome}</p>
        <img class="img" src="${img}" alt="">
        <p class="mensagem">${texto}</p>
    </div>`

    conversa.innerHTML += msg
}