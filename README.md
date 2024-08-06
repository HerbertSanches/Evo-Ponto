<!-- Por questões de segurança, será adotado alguns padrões para salvar no localStorage ou sessionStorage
    começando com o nome do que seria e o nome aleatório criado para que não possam saber o que é, sendo assim:

    (o nome das chaves no local o sessionStorage não pode ser cryptografado toda vez pelas funções, pois as funções mudam os resultados todas as vezes
    mas descryptografam corretamente, mas o Valores que vem da api em si são todas cryptografadas)
