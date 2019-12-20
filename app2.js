var Sequelize = require('sequelize');

// Precisamos criar uma conexão co o banco de dados atual, o SQLite irá criar
// este arquivo caso o mesmo não exista ainda
var db = new Sequelize('sqlite://db.sqlite');

// Vamos modificar um pouco o nosso esquema para que o mesmo crie um hash
// das senhas digitadas em vez de guardá-las de um jeito inseguro
var crypto = require('crypto');
var Usuario = db.define('Usuario', {
    nome: Sequelize.STRING,
    sobrenome: Sequelize.STRING,
    senha: Sequelize.STRING,
    aniversario: Sequelize.DATE
}, {

    // Criamos um método de instância ao declarar valores dentro deste objeto
    instanceMethods: {

        // Vamos criar uma função que nos ajuda a verificar a senha
        verificaSenha: function (senha) {
            var hash = crypto.createHash('sha1').update(senha).digest('hex');

            // Agora basta verificar se a senha que passamos para a verificação
            // é a mesma senha que está registrada para este usuário
            return hash === this.get('senha');
        }
    }

});

// Não basta ter um método para verificar a senha, também queremos que
// o schema crie um hash automaticamente quando um usuário for criado
Usuario.hook('beforeCreate', function (usuario, opts, cb) {

    // Alteramos o campo "senha" para um hash sha1 da mesma
    usuario.set({
        senha: crypto.createHash('sha1').update(usuario.get('senha')).digest('hex')
    });

    // Chamamos o callback com a instância modificada do usuário
    cb(null, usuario);
});

// Agora basta testar o que acabamos de criar
Usuario.create({
    nome: 'Alan',
    sobrenome: 'Hoffmeister',
    senha: '123',
    aniversario: new Date(1989, 9, 10)
}).then(function (usuario) {
    // Verificamos se criou o hash sha1
    console.log('O hash da senha gravada é %s', usuario.get('senha'));

    // Também podemos simular um login, testando uma senha qualquer com a senha
    // gravada no banco de dados através do método que criamos
    var ok = usuario.verificaSenha('senha_diferente');

    console.log('A senha é igual? %s', ok ? 'Sim' : 'Não');

});