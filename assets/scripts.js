var tokenUsuario



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
    var sumir = document.querySelector(".telaDeLogin");              //Extrair
    sumir.style.display = "none";
    var aparecer = document.querySelector(".telaDeQuizzes");
    aparecer.style.display = "flex";
}


//     ----->>>>>     TELA DE QUIZZES

function adicionarQuizz () {
    var sumir = document.querySelector(".telaDeQuizzes");           //Extrair
    sumir.style.display = "none";
    var aparecer = document.querySelector(".telaDeCriacao");
    aparecer.style.display = "flex";

}









//     ----->>>>>     TELA DE CRIAÇÃO DE QUIZZES

function criarPergunta () {
    
}








// "title": "Título do meu quizz",
// 	"data": {
// 		"perguntas": [{
// 			"titulo": "Pergunta 1?",
// 			"respostas": ["1", "2", "3", "4"]
// 		}]
// 	}



//var str = "       Hello World!        ";
//alert(str.trim());
