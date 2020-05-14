
const       bcrypt  =   require('bcryptjs'),
        passport    =   require('passport');

const       User    =   require('../models/Users');


exports.nuevoUsuario = async ({ nombre, email, passwd }) => {
    await User.create({ nombre,email, passwd })
        .then(() => console.log('Usuario creado correctamente') )
        .catch((err) => console.log(err) );

}

// Login y Registrar
const salt = '$2a$10$PUAehJRPGkF9HUbahdC7R.';

exports.loginUsuario = (obj, done) => {
        let { email, passwd } = obj;
        let hash = bcrypt.hashSync(passwd, salt);
        const user = obtenerUsuario({email, 'passwd': hash})
        return user;
};

exports.salir = (req, res) => {
    req.logOut();
    res.redirect('/');
}


const obtenerUsuario = async obj => {
    return await User.findOne({
        where: obj,
    });
}

