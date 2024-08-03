class PontoRoot {
    constructor ({registro_limite, registro_posicao, registro_total, ponto}){
        this.RegistroLimite = registro_limite,
        this.RegistroPosicao = registro_posicao,
        this.RegistroTotal = registro_total,

        this.Ponto = ponto.map( ponto => new Ponto (ponto.ponto, ponto.po_id, ponto.po_idusuario, ponto.po_dthrponto,
            ponto.po_dthrreal, ponto.po_observacao, ponto.po_histdtcadastro, ponto.po_histuscadastro, ponto.po_histdtalteracao,
            ponto.po_histusalteracao, ponto.po_histdtdeletado, ponto.po_histusdeletado, ponto.po_deletado, ponto.po_tipobatida,
            ponto.po_aplicativo
        ))
    }
}

class Ponto {
    constructor(ponto, po_id, po_idusuario, po_dthrponto, po_dthrreal, po_observacao, po_histdtcadastro, po_histuscadastro,
        po_histdtalteracao, po_histusalteracao, po_histdtdeletado, po_histusdeletado, po_deletado, po_tipobatida, po_aplicativo){

        this.RECURSO = ponto,

        this.PoId = po_id,
        this.PoIdUsuario = po_idusuario,
        this.PoDtHrPonto = po_dthrponto,
        this.PoDtHrReal = po_dthrreal,
        this.PoObservacao = po_observacao,
        this.PoHistDtCadastro = po_histdtcadastro,
        this.PoHistUsCadastro = po_histuscadastro,
        this.PoHistDtAlteracao = po_histdtalteracao,
        this.PoHistUsAlteracao = po_histusalteracao,
        this.PoHistDtDeletado = po_histdtdeletado,
        this.PoHistUsDeletado = po_histusdeletado,
        this.PoDeletado = po_deletado,
        this.PoTipoBatida = po_tipobatida,
        this.PoAplicativo = po_aplicativo
    }

    getTipoBatida() {
        const tipoBatidaMap = {
            1: 'BATIDA NORMAL',
            2: 'inserido manualmente',
            3: 'ignorado', //n soma
            4: 'banco de horas normal',//n soma
            5: 'banco de horas descanço',//n soma
            6: 'banco de horas ignorado',//n soma
            7: 'bonificação',
            8: 'batida externa',
            9: 'biometria',
            10:'batido pelo smartphone'          
        }
        return tipoBatidaMap[this.PoTipoBatida] || 'tipo desconhecido';
    }

    getFormatarData() {
        const data = new Date (this.PoDtHrPonto);
        const horaFormatada =  data.getUTCHours().toString().padStart(2, '0');
        const minutos = data.getUTCMinutes().toString().padStart(2, '0');
        return `${horaFormatada}:${minutos}`;
    }

    getCor() {
        const tipoBatidaMap = {
            1: rgbToHex(13, 202, 240),
            2: rgbToHex(245, 245, 245),
            3: rgbToHex(220, 53, 69), 
            4: rgbToHex(112, 128, 144), 
            5: rgbToHex(112, 128, 144),
            6: rgbToHex(112, 128, 144),
            7: rgbToHex(255, 193, 7),
            8: rgbToHex(210, 105, 30),
            9: rgbToHex(25, 135, 84),
            10:rgbToHex(13, 110, 253)          
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
        
        function componentToHex(c) {
            const hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        return tipoBatidaMap[this.PoTipoBatida] || 'tipo desconhecido';
    }
} 

const TPonto =({
    RECURSO: 'ponto',

    FIELD1: 'po_id',
    FIELD2: 'po_idusuario',
    FIELD3: 'po_dthrponto',
    FIELD4: 'po_dthrreal',
    FIELD5: 'po_observacao',
    FIELD6: 'po_histdtcadastro',
    FIELD7: 'po_histuscadastro',
    FIELD8: 'po_histdtalteracao',
    FIELD9: 'po_histusalteracao',
    FIELD10: 'po_histdtdeletado',
    FIELD11: 'po_histusdeletado',
    FIELD12: 'po_deletado',
    FIELD13: 'po_tipobatida', 
    FIELD14: 'po_aplicativo'
})

export {TPonto, PontoRoot, Ponto};