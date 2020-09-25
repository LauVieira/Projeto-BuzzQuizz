var tokenUsuario
var listaDePerguntas = [];
var listaDeNiveis = [];
var listaDoServidor = [];      //precisa ser global?
var quizzDaVez;
var indicePergunta = 3;
var somaDePontos = 0;


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


function adicionarPergunta () {                                                   //refatorar
    var perguntaNova = {};

    var titulo = document.querySelector(".pergunta");
    perguntaNova.titulo = garantirFormato(titulo.value);                    //EXTRAIR SE DER TEMPO
    perguntaNova.titulo = perguntaNova.titulo.replaceAll("?","") + "?";                   //REFAZER LÓGICA

    perguntaNova.opcoes = [];
    for (var i = 1; i < 5; i++) {                         // EXTRAIR SE DER TEMPO
        var opcao = {};
        opcao.resposta = document.querySelector(".respostas input:nth-child(" + i +")").value;
        opcao.resposta = garantirFormato(opcao.resposta);
        opcao.imagem = document.querySelector(".imagens input:nth-child(" + i +")").value;
        opcao.classe = "errada";
        if (i === 1) opcao.classe = "correta";
        perguntaNova.opcoes.push(opcao);
    }
    console.log(perguntaNova);
    listaDePerguntas.push(perguntaNova);
    limparInputs(".caixaDePerguntas");
    mudarIndice(".caixaDePerguntas", listaDePerguntas.length);
}


function garantirFormato (texto) {
    texto = texto.trim();
    texto = texto.charAt(0).toUpperCase() + texto.slice(1);
    texto=texto.replaceAll("  "," ");      // tratando espaçamento duplo acidental no meio da frase
    texto=texto.replaceAll("  "," ");      // repetição para casos de espaçamento extra originalmente ímpar
    return texto;
}


/* ORDEM LÓGICA DE VERIFICAÇÃO:  (Conjunto de todas as funções)
function teste () {
  var caixa = document.querySelector("input");
  texto=caixa.value
  texto = texto.trim();
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);
  texto=texto.replaceAll("?","");
  texto+="?";
  texto=texto.replaceAll("  "," ");
  texto=texto.replaceAll("  "," ");
  alert(texto);
}
*/

function adicionarNivel () {
    var nivelNovo = {};
    var todosInputs = document.querySelectorAll(".caixaDeNiveis input");
    nivelNovo.minimo = todosInputs[0].value;
    nivelNovo.maximo = todosInputs[1].value;
    nivelNovo.titulo = garantirFormato(todosInputs[2].value);
    nivelNovo.imagem = todosInputs[3].value;
    nivelNovo.descricao = garantirFormato(todosInputs[4].value);
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
    var primeiraPergunta = telaDePerguntas.querySelector(".perguntaAtual:nth-child(3)");           //melhorar esse índice pra uma variável
    primeiraPergunta.style.display="flex";
}


function alternativaSelecionada (elementoFigure) {
    revelarCores(elementoFigure);
    checarPonto(elementoFigure);
    setTimeout(proximaPergunta,2000);    
}

function revelarCores (elementoFigure) {
    var alternativas = elementoFigure.parentNode;    //pegando a div mãe
    console.log(alternativas);
    removerClick = alternativas.querySelectorAll("figure");
    alternativas = alternativas.querySelectorAll("figure figcaption");
    for (var i = 0; i < 4; i++) {
        alternativas[i].classList.remove("neutra");
        removerClick[i].removeAttribute("onclick");
    }
}

function checarPonto (elementoFigure) {
    var classe = elementoFigure.querySelector("figcaption");
    classe = classe.className;
    if (classe === "correta") somaDePontos++;
}


function proximaPergunta () {
    var indiceMaximo = quizzDaVez.data.perguntas.length + 2;
    if (indicePergunta < indiceMaximo) {
        var indiceSai = indicePergunta;
        indicePergunta++;
        mudarDeTela(".perguntaAtual:nth-child(" + indiceSai + ")",".perguntaAtual:nth-child(" + indicePergunta + ")");
    }
    else setTimeout(finalizarQuizz,2000);
}


function finalizarQuizz () {
    var scorePorcento = calcularScore();
    var indiceNivel = descobrirIndice(scorePorcento);
    gerarResultado(quizzDaVez.data.niveis[indiceNivel]);
    mudarDeTela(".telaDePerguntas",".telaDeResultado");
}


function calcularScore () {
    var totalPerguntas = quizzDaVez.data.perguntas.length;
    var scorePorcento = Math.round(somaDePontos / totalPerguntas * 100);
    return(scorePorcento);
}

function descobrirIndice (score) {
    var niveis = quizzDaVez.data.niveis;
    for (var i = 0; i < niveis.length; i++) {
        var minimo = parseInt(niveis[i].minimo);
        var maximo = parseInt(niveis[i].maximo);
        if (score >= minimo && score <= maximo) return i;
    }
}



//     ----->>>>>     TELA DE RESULTADO


function gerarResultado (nivel) {
    var telaDeResultado = document.querySelector(".telaDeResultado");
    renderizarResultado(telaDeResultado,nivel);
}




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
        htmlImagens += "<figure onclick='alternativaSelecionada(this)'><img src=" + quizzDaVez.data.perguntas[i].opcoes[j].imagem + ">";
        htmlImagens += "<figcaption class='neutra " + quizzDaVez.data.perguntas[i].opcoes[j].classe + "' >";
        htmlImagens += quizzDaVez.data.perguntas[i].opcoes[j].resposta;
        htmlImagens += "</figcaption></figure>";
    }
    return htmlImagens;
}

function renderizarPerguntas (i) {
    var htmlPerguntas = "";
    var indiceH2 = i+1;
    htmlPerguntas += "<h2>" + indiceH2 + ". " + quizzDaVez.data.perguntas[i].titulo + "</h2>";
    htmlPerguntas += "<div class='alternativas'>";
    htmlPerguntas += renderizarImagens (i);
    htmlPerguntas += "</div>";
    return htmlPerguntas;
}

function renderizarResultado(secao,nivel) {
    var score = calcularScore()+"%";
    var texto = "";
    console.log(nivel);
    texto += "<header class='headerFixo'>BuzzQuizz</header>";
    texto += "<h1>" + quizzDaVez.title + "</h1>";
    texto += "<h2>Você acertou " + somaDePontos + " de " + quizzDaVez.data.perguntas.length + " perguntas!<br>";
    texto += "Score: " + score + "</h2>";
    texto += "<div class='caixaDescricaoResultado'>";
    texto += "<div class='textoResultado'>";
    texto += "<h3>" + nivel.titulo + "</h3>";
    texto += "<p>" + nivel.descricao + "</p>";
    texto += "</div";
    texto += "<img src=" + nivel.imagem + ">";
    texto += "</div>";
    secao.innerHTML = texto;
}