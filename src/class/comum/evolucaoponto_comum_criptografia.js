const secret = "RjCfY;)Q&t~Ne(Tm'9{[63"
const idLocalStorage = "V't}NUX>?(3%baA#Fe)Cuj";
const nomeLocalStorage = "RwUTZ]6d8)A^c9W3k_~eC";
const permissao = "Cvf!q:ydPs%*AFS4YEJa&e";

const url = "http://localhost:54323/evolcentralserv/v1/";
//const url = "https://www.evolucaosistemas-interno.com/evolcentralserv/v1/"

let decryptado;

async function encrypt (encryptar) {
    return CryptoJS.AES.encrypt(encryptar,secret).toString()
}

async function decrypt (decryptar) {
    let bytes = CryptoJS.AES.decrypt(decryptar,secret)
    decryptado = bytes.toString(CryptoJS.enc.Utf8)
    return decryptado
}

export {encrypt, decrypt, idLocalStorage, nomeLocalStorage, url, permissao};