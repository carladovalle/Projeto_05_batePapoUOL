let usuario = { name: null};
let nomeusuario = "";
let type = "message";
let contato = "Todos";

function Entrar() {
    document.querySelector(".telaLogin button").removeAttribute("disabled");
}

function login() {
    usuario.name = document.getElementById("nomeLogin").value;
    console.log(usuario);
    if(usuario.name !== null) {
        const promiseLogin = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", usuario);
        promiseLogin.then(validarSucesso); 
        promiseLogin.catch(erroLogin); 
    }
}

function validarSucesso() {
    document.querySelector(".inserirUsuario").classList.add("escondido"); 
    document.querySelector(".botaoEntrar").classList.add("escondido");
    document.querySelector(".carregando").classList.remove("escondido");

    setTimeout(function () {
    let login = document.querySelector(".telaLogin");
    login.classList.add("escondido");
    let msg = document.querySelector(".telaMensagens");
    msg.classList.remove("escondido");
    carregarDados();
    setInterval(recarregarPagina,3000);
    },4000)
}

function erroLogin() {
    console.log(error.response);
    if (error.response.status === 409) {
    alert("O nome já está sendo utilizando. Por favor, digite outro!");
  }
}

function carregarDados() {
    const promiseCarregarDados = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promiseCarregarDados.then(renderizarMensagens);
}

function renderizarMensagens(mensagens) {
    document.querySelector("main ul").innerHTML="";
    console.log(mensagens);
    mensagens.data.forEach(addMensagem);
}

function addMensagem(mensagem) {
    switch(mensagem.type) {
        case "status":
            document.querySelector("main ul").innerHTML+=
            `<li data-identifier="message" ${mensagem.type}>&nbsp(${mensagem.time})&nbsp${mensagem.from}&nbsp${mensagem.text}</li>`
            break;
        case "message":
            document.querySelector("main ul").innerHTML += 
            `<li data-identifier="message" ${mensagem.type}>&nbsp(${mensagem.time})&nbsp${mensagem.from}&nbsppara&nbsp${mensagem.to}: &nbsp${mensagem.text}</li>`
            break;
        case "private_message":
            if(mensagem.to === usuario.name || mensagem.from === usuario.name) {
                document.querySelector("main ul").innerHTML+=
                `<li data-identifier="message" ${mensagem.type}>&nbsp(${mensagem.time})&nbsp${mensagem.from}reservadamente para &nbsp${mensagem.to}&nbsp: &nbsp${mensagem.text}</li>`
                break;
            }
        default:
    }
    let mensagemnova = document.querySelector('main ul').lastElementChild;
    mensagemnova.scrollIntoView();
}

function recarregarPagina() {
    carregarDados();
    carregarParticipantes();
    const online = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",usuario);
    console.log(online);
    online.then();
}

function carregarParticipantes () {
    const promiseCarregar = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    console.log(promiseCarregar);
}

function enviarMensagem () {
    let mensagem = document.querySelector(".caixaMensagem textarea").value;
    if (mensagem) {
        let objetoMensagem = {
            from: usuario.name,
            to: contato,
            text: mensagem,
            type: type,
        }
        const promiseEnviar = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objetoMensagem);
        promiseEnviar.then(mensagemEnviada);
        promiseEnviar.catch(mensagemErro);
    }    
}

function mensagemEnviada () {
    document.querySelector(".caixaMensagem textarea").value="";
    carregarDados();
}

function mensagemErro(){
    window.location.reload();
}
