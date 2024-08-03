import {decrypt, idLocalStorage, permissao, url} from "../../src/class/comum/evolucaoponto_comum_criptografia.js";
import {TPonto, PontoRoot} from '../../src/class/base/evolucaoponto_base_ponto.js';
import {chamarBatida} from "./home.js";
import {UsuarioRoot, TUsuario} from "../../src/class/base/evolucaoponto_base_usuario.js";

document.addEventListener("DOMContentLoaded", () => {

    const showmodal = document.querySelector('.showmodal');

    fetch('/evolinterno/modal.html')
    //fetch('/modal.html')
    .then(res => res.text())
    .then(data => {
        showmodal.innerHTML = data;
        
        const modal = document.getElementById('modal-container');
        const closeButton = document.getElementById('fechar');
        const cancelar = document.querySelector('.cancelar')
        const textarea = document.getElementById('texto');
        const contador = document.getElementById('contador');
        const confirmarBatida = document.querySelector('.confirmar');

        document.querySelector(".chamarPonto").addEventListener("click", (e) => {
           let permissaoLocalStorage = localStorage.getItem(permissao)
            if (permissaoLocalStorage){
                modal.classList.add('mostrar');
            } else {
                e.preventDefault();
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal-container' || e.target.id === 'fechar') {
                modal.classList.remove('mostrar');
                textarea.value = '';
            }
        });

        closeButton.addEventListener('click', () => {
            modal.classList.remove('mostrar');
            
        });

        cancelar.addEventListener('click', () => {
            modal.classList.remove('mostrar');
            
        });
        
        if (textarea && contador) {
            textarea.addEventListener('input', () => {
                contador.textContent = textarea.value.length;
            });
        };

        confirmarBatida.addEventListener('click', () => {
            enviarBatida();
        });
    });
});

async function enviarBatida() {

    const idCrypto = localStorage.getItem(idLocalStorage);
    const idDesCrypto = await decrypt (idCrypto);        
    const observacao = document.getElementById('texto').value;

    fetch(`${url}ponto/bater`,{
        method: "POST",
        headers: {
            "content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
           
            [TPonto.FIELD2]: idDesCrypto,
            [TPonto.FIELD13]: 10,
            [TPonto.FIELD5]: observacao,
            [TPonto.FIELD14]: "web",
            "permissaobatida" : 3 

        })
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById('texto').value = '';

        const valorJson = response;
        
        const modal = document.getElementById('modal-container');
        modal.classList.remove('mostrar');
        
        chamarBatida(); 
    })
    .catch(error => {
        observacaoSemValue = '';
        console.error('Erro ao receber usuário:', error);
    }) ;
}