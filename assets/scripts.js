var tokenUsuario
var listaDePerguntas = [];
var listaDeNiveis = [];
var listaDoServidor = [];      //precisa ser global?
var quizzDaVez;


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
    mudarDeTela(".telaDeLogin",".telaDeQuizzes");
    pedirQuizzes();
}


//     ----->>>>>     TELA DE QUIZZES

function criarQuizz () {
    mudarDeTela(".telaDeQuizzes",".telaDeCriacao");
}

function pedirQuizzes () {
    var header = configurarHeader();
    var requisicao = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes', header);
    requisicao.catch(exibirErro).then(carregarQuizzes);
}

function carregarQuizzes (resposta) {
    listaDoServidor = resposta.data;
    var caixaDeQuizzes = document.querySelector(".caixaDeQuizzes");
    for (var i = 0; i < resposta.data.length; i++) {
        var textoTitulo = resposta.data[i].title;
        caixaDeQuizzes.appendChild(renderizarListaDeQuizzes(textoTitulo));     // DEIXAR MAIS CURTO OU FAZER MAIS LEGÍVEL?
    }
}


function carregarQuizz (quizz) {
    var indiceQuizz = encontrarIndice(quizz.innerText);
    quizzDaVez = listaDoServidor[indiceQuizz];
    gerarQuizz();
    mudarDeTela(".telaDeQuizzes",".telaDePerguntas");    
}


function encontrarIndice (titulo) {
    for (var i = 0; i < listaDoServidor.length; i++) {
        if (listaDoServidor[i].title === titulo) return i
    }
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
    var header = configurarHeader();
    var requisicao = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes',  novoQuizz, header);
    requisicao.catch(exibirErro).then(fecharCriacao);             //
}


function fecharCriacao () {
    listaDePerguntas = [];
    listaDeNiveis = [];
    mudarDeTela(".telaDeCriacao",".telaDeQuizzes");
}






//     ----->>>>>     TELA DE PERGUNTAS


function gerarQuizz () {
    var telaDePerguntas = document.querySelector(".telaDePerguntas");
    telaDePerguntas.querySelector("h1").innerText = quizzDaVez.title;

    for (var i = 0; i < quizzDaVez.data.perguntas.length; i++) {
        var elemento = document.createElement("div");
        elemento.classList.add("perguntaAtual");
        elemento.innerHTML = renderizarPerguntas(i);                               // MELHORAR ISSO MANDANDO A LISTA DE PERGUNTAS NO INDICE
        telaDePerguntas.appendChild(elemento);
    }
}


/*


CRIAR UMA DIV <div class="perguntaAtual"> PARA CADA PERGUNTA DA LISTA  (quizzDaVez.data.perguntas.length)
E DAR APPEND AQUI: <section class="telaDePerguntas">

<div class="perguntaAtual">

    <h2>Ninguém aguenta mais o jovem místico</h2>

    <div class="alternativas">

        CRIAR ESSE ARRAY ****** E CONCATENAR AQUI

    </div>

</div>



*****



//embaralharAlternativas()?? onde por?
//renderizarPerguntas (i)
//function renderizarImagens (i) {



*/




//botao.classList.toggle("desabilitarBotao"); LEMBRAR DESSA FUNÇÃO PARA DESABILITAR CLIQUES REPETIDOS NAS ALTERNATIVAS

//     ----->>>>>     FUNCIONALIDADES GERAIS


function configurarHeader () {
    var header = {
        headers: {
        "User-Token": tokenUsuario }
    }
    return header;
}

function exibirErro (resposta) {
    console.log(resposta);
}

function mudarDeTela(classeSai,classeEntra) {
    var sumir = document.querySelector(classeSai);           
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


function embaralharAlternativas(i) {
    quizzDaVez.data.perguntas[i].opcoes.sort(comparador);
}
function comparador() { 
	return Math.random() - 0.5; 
}


//     ----->>>>>     FUNÇÕES DE RENDERIZAÇÃO


function renderizarListaDeQuizzes (nomeQuizz) {
    var elemento = document.createElement("article");
    elemento.setAttribute("onclick","carregarQuizz(this)");
    elemento.innerText = nomeQuizz;
    return elemento;
}


function renderizarImagens (i) {       // vou receber índice ou a lista de uma vez?    FAZER ASSIM E MUDAR NO FINAL SE DER CERTO
    var htmlImagens = "";
    embaralharAlternativas(i);
    for (var j = 0; j < 4; j++) {
        htmlImagens += "<figure><img src=" + quizzDaVez.data.perguntas[i].opcoes[j].imagem + ">";
        htmlImagens += "<figcaption class=neutra " + quizzDaVez.data.perguntas[i].opcoes[j].classe + ">";
        htmlImagens += quizzDaVez.data.perguntas[i].opcoes[j].resposta;
        htmlImagens += "</figcaption></figure>";
    }
    return htmlImagens;
}

function renderizarPerguntas (i) {
    var htmlPerguntas = "";
    htmlPerguntas += "<h2>" + quizzDaVez.data.perguntas[i].titulo + "</h2>";
    htmlPerguntas += "<div class='alternativas'>";
    htmlPerguntas += renderizarImagens (i);
    htmlPerguntas += "</div>";
    return htmlPerguntas;
}





// <h2>Ninguém aguenta mais o jovem místico</h2>

// <div class="alternativas">

//    CRIAR ESSE ARRAY ****** E CONCATENAR AQUI

// </div>