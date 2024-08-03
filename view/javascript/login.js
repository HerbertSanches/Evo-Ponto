import {encrypt, decrypt, idLocalStorage, nomeLocalStorage, url} from "../../src/class/comum/evolucaoponto_comum_criptografia.js";
import {UsuarioRoot, TUsuario} from "../../src/class/base/evolucaoponto_base_usuario.js";

var usuarioLogin;
var encryptedPassword;  // Variável global para armazenar a senha criptografada

const containerLogin = document.getElementById('login_container');
const erroServidor = document.getElementById('erroCarregar');

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function main(input) {
    const hash1 = await sha256(input);
    const p1 = hash1.slice(0, 64);
    const p2 = await sha256(p1);
    const result = p2 + await sha256(input);
    return result;
}

async function encryptPassword(input) {
    encryptedPassword = await main(input);
}

async function chamarCryptografia() { 
    let input = document.querySelector(".user_password").value;
    await encryptPassword(input);
    enviarPonto();
}

document.addEventListener("DOMContentLoaded", function() {
    const erroRecarregar = document.getElementById('recarregar');
    erroRecarregar.addEventListener("click", (e) => {
        e.preventDefault();
        enviarPonto()
    })

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            chamarCryptografia();  
        })

    }
});

function enviarPonto() {
    usuarioLogin = document.querySelector(".user_name").value;
    chamaPost();
}

async function chamaPost() {
    await postUsuario();
    chamarHome();
}

var user;
let valorJson;
async function postUsuario() {
    return fetch(`${url}usuario/login`, {
        
        method: "POST",
        headers: {
            "content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
           [TUsuario.FIELD2]: usuarioLogin,
           [TUsuario.FIELD3]: encryptedPassword
        })
    })
    .then(response => response.json())
    .then(response => {
        const loginInvalido = document.querySelector('.login_erro');
        containerLogin.style.display = 'flex';
        erroServidor.style.display = 'none';
        
        valorJson = response;
        
        if (valorJson.situacao == -1 ){
            loginInvalido.style.display = 'block'
            loginInvalido.innerText = "Usuário e/ou senha incorretos"
            return; // Interrompe a execução do then

        }
        user = new UsuarioRoot(valorJson);

        if(user.Usuario[0].UsId && user.Usuario[0].UsUsuario) {
            salvarLocalstorage(user.Usuario[0].UsId, user.Usuario[0].UsUsuario)
        } else {
            console.log("erro ao adicionar no localStorage")
        };
        
    })
    .catch(error => {
        const loginInvalido = document.querySelector('.login_erro');
       console.log(error.message)

        try{
            if (user.Situacao === -1){
                loginInvalido.style.display = 'block'
                loginInvalido.innerText = "Usuáriosss e/ou senha incorretos"
            }
        } catch {
            loginInvalido.style.display = 'block'
            
            const imgErro = document.getElementById('erroImg')
            imgErro.innerHTML = `<img src="src/assets/images/404.svg" alt="">`
            erroServidor.style.display = 'flex';
            containerLogin.style.display = 'none';
         }; 
    });
}

async function salvarLocalstorage(usuarioid, usuarionome) {
    const salvarIdLocal = await encrypt(usuarioid);
    const salvarNomeLocal = await encrypt(usuarionome);
    
    localStorage.setItem(idLocalStorage, salvarIdLocal);
    localStorage.setItem(nomeLocalStorage, salvarNomeLocal);  
}

async function chamarHome() {
    if (user.Usuario[0].UsId) {      
       window.location.href = '/evolinterno/home.html';
       //window.location.href = 'home.html';
    }  
}