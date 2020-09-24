var tokenUsuario
var listaDePerguntas = [];
var listaDeNiveis = [];



//     ----->>>>>     TELA DE LOGIN

function pegarDadosUsuario () {
    var objetoUsuario={};
    objetoUsuario.email = document.querySelector("#email").value;
    objetoUsuario.password = document.querySelector("#senha").value;
    if (objetoUsuario.email !== "" && objetoUsuario.password !== "") {
        enviarUsuario(objetoUsuario);
    } else {
        alert ("Por favor, insira dados válidos");
    }
}

function enviarUsuario (objetoUsuario) {
    desabilitarHabilitarBotao();
    var requisicaoPost = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/users",objetoUsuario);
    requisicaoPost.catch(erroUsuario).then(processarUsuario);
}

function erroUsuario (resposta) {
    console.log(resposta);
    alert ("Email e/ou senha incorretos, tente novamente");
    desabilitarHabilitarBotao();
}

function desabilitarHabilitarBotao () {
    var botao = document.querySelector(".caixaDeLogin button");
    botao.classList.toggle("desabilitarBotao");
}

function processarUsuario (resposta) {
    tokenUsuario = resposta.data.token;
    console.log(tokenUsuario);
    mudarDeTela(".telaDeLogin",".telaDeQuizzes");
}


//     ----->>>>>     TELA DE QUIZZES

function criarQuizz () {
    mudarDeTela(".telaDeQuizzes",".telaDeCriacao");
}



//     ----->>>>>     TELA DE CRIAÇÃO DE QUIZZES

function adicionarPergunta () {
    var perguntaNova = {};

    var titulo = document.querySelector(".pergunta");
    perguntaNova.titulo = titulo.value;

    perguntaNova.opcoes = [];
    for (var i = 1; i < 5; i++) {                         // EXTRAIR SE DER TEMPO
        var opcao = {};
        opcao.resposta = document.querySelector(".respostas input:nth-child(" + i +")").value;
        opcao.imagem = document.querySelector(".imagens input:nth-child(" + i +")").value;
        opcao.classe = "errada";
        if (i === 1) opcao.classe = "correta";
        perguntaNova.opcoes.push(opcao);
    }

    listaDePerguntas.push(perguntaNova);
    limparInputs(".caixaDePerguntas");
    mudarIndice(".caixaDePerguntas", listaDePerguntas.length);
}


function adicionarNivel () {
    var nivelNovo = {};
    var todosInputs = document.querySelectorAll(".caixaDeNiveis input");
    nivelNovo.minimo = todosInputs[0].value;
    nivelNovo.maximo = todosInputs[1].value;
    nivelNovo.titulo = todosInputs[2].value;
    nivelNovo.imagem = todosInputs[3].value;
    nivelNovo.descricao = todosInputs[4].value;
    listaDeNiveis.push(nivelNovo);
    limparInputs(".caixaDeNiveis");
    mudarIndice(".caixaDeNiveis", listaDeNiveis.length);
}


function adicionarQuizz () {                                                   //REFATORAR SE DER TEMPO
    var novoQuizz = {};
    var tituloQuizz = document.querySelector(".tituloQuizz").value;
    novoQuizz.title = tituloQuizz;
    novoQuizz.data = {};
    novoQuizz.data.perguntas = listaDePerguntas;
    novoQuizz.data.niveis = listaDeNiveis;
    console.log(novoQuizz);
    mandarProServidor(novoQuizz);
}


function mandarProServidor(novoQuizz) {                      // REFATORAR SE DER TEMPO
    var configuraHeader = {
        headers: {
        "User-Token": tokenUsuario }
    }
    var requisicao = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes',  novoQuizz, configuraHeader);
    requisicao.catch(exibirErro).then(fecharCriacao);             //
}


function fecharCriacao () {
    listaDePerguntas = [];
    listaDeNiveis = [];
    mudarDeTela(".telaDeCriacao",".telaDeQuizzes");
}


//     ----->>>>>     FUNCIONALIDADES GERAIS

function exibirErro (resposta) {
    console.log(resposta);
}


function mudarDeTela(classeSai,classeEntra) {
    var sumir = document.querySelector(classeSai);           //Extrair
    sumir.style.display = "none";
    var aparecer = document.querySelector(classeEntra);
    aparecer.style.display = "flex";
}


function limparInputs (classe) {
    var todosInpus = document.querySelectorAll(classe + " input");
    for (var i = 0; i < todosInpus.length; i++) {
        todosInpus[i].value = "";
    }
}

function mudarIndice (classe,indice) {
    indice++;
    var indiceP = document.querySelector(classe + " p");
    var texto = indiceP.innerText;
    texto = texto.slice(0, -1) + indice;
    indiceP.innerText = texto;
}








// LEMBRAR DE ZERAR VARIAVEIS LISTA DE PERGUNTAS E LISTAS DE NIVEIS





// "title": "Título do meu quizz",
// 	"data": {
// 		"perguntas": [{
// 			"titulo": "Pergunta 1?",
// 			"respostas": ["1", "2", "3", "4"]
// 		}]
// 	}



//var str = "       Hello World!        ";
//alert(str.trim());
