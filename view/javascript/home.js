import {encrypt, decrypt, idLocalStorage, nomeLocalStorage, url, permissao} from "../../src/class/comum/evolucaoponto_comum_criptografia.js";
import {TPonto, PontoRoot} from '../../src/class/base/evolucaoponto_base_ponto.js';
import {UsuarioRoot, TUsuario} from "../../src/class/base/evolucaoponto_base_usuario.js";

var diaIndex;
let ponto;
let horasCalcDiff = [];

document.addEventListener("DOMContentLoaded", function() {
    const btnPonto = document.querySelector('.chamarPonto')
    btnPonto.disabled = true;

    if (localStorage.getItem(idLocalStorage) && localStorage.getItem(nomeLocalStorage)) {
        console.log("aprovado")
    } else {
        window.location.href = "/evolinterno/login.html";
        //window.location.href = "login.html";
    }

    const logout = document.getElementById('logout')
    logout.addEventListener("click", (e) => {
        e.preventDefault();
        logoutSistema()
    })

    const erroRecarregar = document.getElementById('recarregar');
    erroRecarregar.addEventListener("click", (e) => {
        e.preventDefault();
        location.reload();
    })

    const currentDate = new Date();
    pontosDiaSelecionado(currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear())

    let anteriorSemana = document.getElementById('prev') 
    anteriorSemana.addEventListener("click", (e) => {
        e.preventDefault();
        changeWeek(-1)
    });

    let proxSemana = document.getElementById('next') 
    proxSemana.addEventListener("click", (e) => {
        e.preventDefault();
        changeWeek(1)
    });

    let focarHoje = document.getElementById('today')
    focarHoje.addEventListener("click", (e) => {
        e.preventDefault();
        goToToday()
    });

    verificarPermissao();
    chamarNome();
});

function logoutSistema() {
    localStorage.clear()
    window.location.href = "/evolinterno/login.html";
    //window.location.href = "login.html";
}

async function chamarNome() {
    const NomeStorage = localStorage.getItem(nomeLocalStorage)

    const nomeDecry =  await decrypt(NomeStorage)

    let nomeHtmlElement = document.querySelector('.nomeUsuario')

    nomeHtmlElement.innerHTML = `${nomeDecry}`;
}

async function converterData(dateString) {
    // Supondo que a data esteja no formato DD/MM/YYYY
    const [day, month, year] = dateString.split('/');
    // Retornando a data no formato MM/DD/YYYY
    return `${month}-${day}-${year}`;
}

const erroServidor = document.getElementById('erroCarregar');
const containerPonto = document.getElementById('eponto-container');

async function chamarBatida() {
    
    const idCrypto = localStorage.getItem(idLocalStorage); 
    const idDesCrypto = await decrypt (idCrypto);          
    const coIGUAL = 1; 
    const ftInteger = 3; 
    const dtSemConverter = document.querySelector('.dataCompleta').textContent.trim()
    const dtInicial = await converterData(dtSemConverter)
    const dtFinal = dtInicial;
    const coBETWEEN = 10; 
    const ftDate = 9; 

    const json = {
        ponto: [
            {
            campo: TPonto.FIELD2,
            valor: idDesCrypto,
            condicao: coIGUAL,
            tipo: ftInteger
            },
            {
            campo: TPonto.FIELD3,
            valor: `'${dtInicial}'|'${dtFinal}'`,
            condicao: coBETWEEN,
            tipo: ftDate
            }
        ]
    };

    const jsonString = JSON.stringify(json);

    fetch(`${url}ponto/localizar`,{
        method: "POST",
        headers: {
            "content-type": "application/json; charset=UTF-8"
        },
        body: jsonString
    })
    .then(response => response.json())
    .then(response => {
        containerPonto.style.display = 'flex';
        erroServidor.style.display = 'none'
    
        const valorJson = response
        ponto = new PontoRoot(valorJson)

        const pontosDia = document.querySelector('.pontosDia');
        pontosDia.innerHTML = "";
        ponto.Ponto.forEach(ponto => {
            
            const divBatidas = document.createElement('div');
            divBatidas.classList.add('batidas')
           
            const horaFormatada = ponto.getFormatarData() ;

            if (![3, 4, 5, 6].includes(ponto.PoTipoBatida)){ 
                horasCalcDiff.push(horaFormatada);
            }

            const tipoBatida = ponto.getTipoBatida(); 
            
            divBatidas.innerHTML = `<p>${horaFormatada}</p> <p>${tipoBatida}</p>`;

            divBatidas.style.backgroundColor = ponto.getCor();

            if (ponto.PoTipoBatida == 2) {
                divBatidas.style.color = "black"
            } 

            pontosDia.appendChild(divBatidas)
        });

        calcularHoras(horasCalcDiff)
    })
    .catch(error => {
        const imgErro = document.getElementById('erroImg')
        imgErro.innerHTML = `<img src="src/assets/images/404.svg" alt="">`

        erroServidor.style.display = 'flex';
        containerPonto.style.display = 'none';
    })
}

async function verificarPermissao() {
    const permissaoBatida = '3';
    const idCrypto = localStorage.getItem(idLocalStorage); 
    const idDesCrypto = await decrypt (idCrypto); 

    fetch(`${url}ponto/validarusuario/${idDesCrypto}/${permissaoBatida}`, {
        
        method: "GET",
        headers: {
            "content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(response => {

        if (response.ponto[0].permitido == 1){
            const btnPonto = document.querySelector('.chamarPonto')
            btnPonto.disabled = false;
            btnPonto.style.opacity = 1
            localStorage.setItem(permissao, true);
        } 
        chamarBatida();
    })
}

function calcularHoras(arrayHoras) {
    const totalHours = (diaIndex === 6 ) ? 4 : 8;
    let workedHours = 0;

    //batidas vêm em pares de entrada e saída
    for (let i = 0; i < arrayHoras.length; i += 2) {
        const entry = arrayHoras[i];
        const exit = arrayHoras[i + 1];
        if (exit) { // Garantir que haja um par de saída
            workedHours += calculateHours(entry, exit);
        } else {
            // Se não houver um par de saída, considerar a hora atual como saída
            const currentTime = new Date();
            const currentHours = String(currentTime.getHours()).padStart(2, '0');
            const currentMinutes = String(currentTime.getMinutes()).padStart(2, '0');
            const currentTimeString = `${currentHours}:${currentMinutes}`;
            workedHours += calculateHours(entry, currentTimeString);
        }
    }

    let minTrabFormatadas
    let SomaHrsTrabFormatadas
    let DiferencaHrsTrabFormatadas

    const remainingHours = totalHours - workedHours;

    const remainingMinutes = Math.round((remainingHours % 1) * 60); 
    const horasInteiras = parseInt(remainingHours);

    minTrabFormatadas = Math.abs(remainingMinutes) < 10 ? 
    (remainingMinutes < 0 ? '0' + Math.abs((remainingMinutes) * -1) : '0' + remainingMinutes) : 
    remainingMinutes;
    
    DiferencaHrsTrabFormatadas = Math.abs(horasInteiras) < 10 ? 
    (horasInteiras < 0 ? '0' + Math.abs((horasInteiras) * -1) : '0' + horasInteiras) : 
    horasInteiras;

    const horaFinal = DiferencaHrsTrabFormatadas +':'+ minTrabFormatadas;

    let minutosTrabalhados = Math.round((workedHours % 1) * 60);
    const horasTrabalhados = parseInt(workedHours);
    
    SomaHrsTrabFormatadas = Math.abs(horasTrabalhados) < 10 ? 
    (horasTrabalhados < 0 ? '0' + Math.abs((horasTrabalhados) * -1) : '0' + horasTrabalhados) : 
    horasTrabalhados;

    let minutosFormatados = Math.abs(minutosTrabalhados) < 10 ? 
    (minutosTrabalhados < 0 ? '-0' + Math.abs((minutosTrabalhados) * -1) : '0' + minutosTrabalhados) : 
    minutosTrabalhados;

    if (minutosFormatados < 0) {
        minutosFormatados = (minutosFormatados) * (-1)
    }

    document.getElementById('soma').innerText = `${SomaHrsTrabFormatadas}:${minutosFormatados}`;
    document.getElementById('diferenca').innerText = `${horaFinal}`;

    const restamFaltam = document.getElementById('restamFaltam')
    if (horasInteiras < 0 || remainingMinutes < 0) {

        restamFaltam.innerHTML = 'Sobram'
    } else {
        restamFaltam.innerHTML = 'Restam'
    }

    horasCalcDiff = [];
}

function calculateHours(entry, exit) {
    const [entryHours, entryMinutes] = entry.split(':').map(Number);
    const [exitHours, exitMinutes] = exit.split(':').map(Number);

    let start = new Date(0, 0, 0, entryHours, entryMinutes, 0);
    let end = new Date(0, 0, 0, exitHours, exitMinutes, 0);
    let diff = (end - start) / (1000 * 60 * 60); // convertendo para horas

    return diff;
}


//---------calendário--------

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
let semanaAtual = 0;
let selectedDate = null;

function loadWeek(weekOffset) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const today = new Date();
    today.setDate(today.getDate() + (weekOffset * 7));

    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.innerHTML = `
            <div class ="diaCalendar">${day.getDate()}</div>
            <div>${daysOfWeek[day.getDay()]}</div>
        `;
        dayElement.addEventListener('click', () => selectDay(dayElement, day));
        
        // Verifica se o dia é o dia selecionado ou o dia atual
        if (selectedDate) {
            if (day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear()) {
                dayElement.classList.add('selected');
            }
        } else {
            if (day.getDate() === currentDate.getDate() && day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear()) {
                dayElement.classList.add('selected');
                selectDay(dayElement, day)
            }
        }

        calendar.appendChild(dayElement);
    }
}

function selectDay(element, date) {
    const days = document.querySelectorAll('.day');
    days.forEach(day => day.classList.remove('selected'));
    element.classList.add('selected');
    
    const day = date.getDate();
    const month = date.getMonth() + 1; // Meses começam do 0
    const year = date.getFullYear();

    selectedDate = new Date(year, date.getMonth(), day);
    diaIndex = date.getDay();
    pontosDiaSelecionado(day, month, year)
}

function pontosDiaSelecionado(diaSelecionado, mêsSelecionado, anoSelecionado){
   let diaFormatado
   let mêsSelecionadoFormatado

    diaFormatado = Math.abs(diaSelecionado) < 10 ? 
    (diaSelecionado < 0 ? '0' + Math.abs(diaSelecionado) : '0' + diaSelecionado) : 
    diaSelecionado;

    mêsSelecionadoFormatado = Math.abs(mêsSelecionado) < 10 ? 
    (mêsSelecionado < 0 ? '0' + Math.abs(mêsSelecionado) : '0' + mêsSelecionado) : 
    mêsSelecionado;

    const dataCompleta = diaFormatado+"/"+mêsSelecionadoFormatado+"/"+anoSelecionado ;

    const dataElement = document.querySelector(".dataCompleta") 
    dataElement.innerHTML =`
        ${dataCompleta}
    `
    chamarBatida();
}

function changeWeek(direction) {
    semanaAtual += direction;
    loadWeek(semanaAtual);
}

function goToToday() {
    selectedDate = null; // Redefinir a data selecionada
    semanaAtual = 0; // Redefinir a semana atual
    loadWeek(semanaAtual); // Carregar a semana atual
}

// Carregar a semana atual ao iniciar
loadWeek(semanaAtual);

export {chamarBatida, permissao};