// function chamaLoginObj(loginObj){ 
//    loginObj = ({
//     situacao: loginObj.situacao,
//     usuarioId: loginObj.usuario[0].us_id,
//     funcionarioId: loginObj.usuario[0].us_idfuncionario,
//     usuarioNome: loginObj.usuario[0].us_usuario
//     });

//     return loginObj;
// };

class UsuarioRoot {//colocar UsuarioRoot
    constructor ({registro_limite, registro_posicao, registro_total, situacao, usuario}){
        this.RegistroLimite = registro_limite,
        this.RegistroPosicao = registro_posicao,
        this.RegistroTotal = registro_total,

        this.Situacao = situacao,
        this.Usuario = usuario.map(user => new User(user.usuario, user.us_id, user.us_usuario,
            user.us_senha, user.cliente, user.gerarliberacao, user.cadastrar, user.prazo, user.cpf, user.us_idlocalidade,
            user.alteraliberacaolimmax, user.us_idfuncionario, user.us_idmonitoramento, user.us_idsistema, user.us_idlocadicional, 
            user.us_codtv, user.us_histuscadastro, user.us_histdtcadastro, user.us_histusalteracao, user.us_histdtalteracao,
            user.us_histusdeletado, user.us_histdtdeletado, user.us_deletado   
        ))
    }
};

class User {
    constructor (usuario, us_id, us_usuario, us_senha, cliente, gerarliberacao, cadastrar, prazo, 
        cpf, us_idlocalidade, alteraliberacaolimmax, us_idfuncionario, us_idmonitoramento, us_idsistema, us_idlocadicional,
        us_codtv, us_histuscadastro, us_histdtcadastro, us_histusalteracao, us_histdtalteracao, us_histusdeletado, us_histdtdeletado,
        us_deletado){

        this.RECURSO = usuario,
       
        this.UsId = us_id,
        this.UsUsuario = us_usuario,
        this.UsSenha = us_senha, 
        this.UsCliente = cliente,
        this.UsGerarLiberacao = gerarliberacao,
        this.UsCadastrar = cadastrar,
        this.UsPrazo = prazo,
        this.UsCPF = cpf,
        this.UsIdLocalidade = us_idlocalidade,
        this.UsAlteraLiberacaoLimMax = alteraliberacaolimmax,
        this.UsIdFuncionario = us_idfuncionario,
        this.UsIdMonitoramento = us_idmonitoramento, 
        this.UsIdSistema = us_idsistema,
        this.UsIdLocalidadeAdicional = us_idlocadicional,
        this.UsCodTv = us_codtv,
        this.Ushistuscadastro = us_histuscadastro,
        this.Ushistdtcadastro = us_histdtcadastro,
        this.Ushistusalteracao = us_histusalteracao,
        this.Ushistdtalteracao = us_histdtalteracao,
        this.Ushistusdeletado = us_histusdeletado,
        this.Ushistdtdeletado = us_histdtdeletado,
        this.Usdeletado = us_deletado
    }
};

const TUsuario =({
    RECURSO: 'usuario',

    FIELD1: 'us_id',
    FIELD2: 'us_usuario',
    FIELD3: 'us_senha',
    FIELD4: 'cliente',
    FIELD5: 'gerarliberacao',
    FIELD6: 'cadastrar',
    FIELD7: 'prazo',
    FIELD8: 'cpf',
    FIELD9: 'us_idlocalidade',
    FIELD10: 'alteraliberacaolimmax',
    FIELD11: 'us_idfuncionario',
    FIELD12: 'us_idmonitoramento',
    FIELD13: 'us_idsistema',
    FIELD14: 'us_idlocadicional',
    FIELD15: 'us_codtv',
    FIELD16: 'us_histuscadastro',
    FIELD17: 'us_histdtcadastro',
    FIELD18: 'us_histusalteracao',
    FIELD19: 'us_histdtalteracao',
    FIELD20: 'us_histusdeletado',
    FIELD21: 'us_histdtdeletado',
    FIELD22: 'us_deletado'
})

export {UsuarioRoot, TUsuario};