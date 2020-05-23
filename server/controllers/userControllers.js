
const       bcrypt  =   require('bcryptjs');

const       User    =   require('../models/Users');


exports.nuevoUsuario = async ({ nombre, email, passwd }) => {
    await User.create({ nombre,email, passwd })
        .then(() => console.log('Usuario creado correctamente') )
        .catch((err) => console.log(err) );

}

// Login y Registrar
exports.loginUsuario = (obj, done) => {
        let { email, passwd } = obj;
        let salt = bcrypt.genSaltSync(10);
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

