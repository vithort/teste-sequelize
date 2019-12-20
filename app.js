var Sequelize = require('sequelize');

// Precisamos criar uma conexão co o banco de dados atual, o SQLite irá criar
// este arquivo caso o mesmo não exista ainda
var db = new Sequelize('sqlite://db.sqlite');

// Já podemos definir um schema!
var Usuario = db.define('Usuario', {
    nome: Sequelize.STRING,
    sobrenome: Sequelize.STRING,
    senha: Sequelize.STRING,
    aniversario: Sequelize.DATE
});

// Para criar esta tabela dentro do banco de dados, precisamos chamar o método
// sync, ele somente irá criar a tabela caso a mesma ainda não exista, isto
// também vale para colunas da tabela que definimos
/*Usuario.sync().then(function () {
    console.log('Tabela de usuários criada!');
});*/

Usuario.create({
    nome: 'Alan',
    sobrenome: 'Hoffmeister',
    senha: '123',
    aniversario: new Date(1989, 9, 10)
}).then(function (usuario) {
    // Neste ponto o nosso usuário já está criado no banco de dados
    // verifique o seu terminal para ver qual query o Sequelize executou
    console.log('Usuário inserido!', usuario.get());

    // Agora buscamos por um usuário com o sobrenome 'Hoffmeister', já que
    // este ORM trabalha com promises, basta retornar uma promise aqui
    return Usuario.findOne({
        where: {
            senha: '123'
        }
    });
}).then(function (usuario) {

    console.log(usuario.sobrenome)
    // Aqui a pesquisa já terá retonado, vamos modificar este usuário para a 
    // data correta e salvar o mesmo no banco de dados.
    usuario.set({
        aniversario: new Date(1989, 9, 14)
    });

    // Novamente, basta retornar uma promise
    return usuario.save();

}).then(function (usuario) {
    // A instância atualizada do usuário está aqui nesta função, podemos
    // agora remover este usuário usando o método destroy
    return usuario.destroy();

}).then(function () {
    console.log('Terminamos de criar, pesquisar, atualizar e excluir!');
});
