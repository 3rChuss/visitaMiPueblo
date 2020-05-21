const Users     =   require('../models/Users');
const bcrypt    =   require('bcryptjs');

exports.adminPanel = (req, res) => {
    let contenido = req.query.contenido;
    let pagina = req.query.titulo ? req.query.titulo : 'Panel de control'
    let usuario = req.user;
    
    if (usuario.role === 'admin' ) {
        let usuarios = getUsuarios()
        .then(usuarios => {
            res.render('admin', {
                pagina,
                contenido,
                usuario,
                usuarios
            })
        });
    } else {
        res.render('admin', {
            pagina,
            contenido,
            usuario
        })
    }
}

// Registrar
const salt = '$2a$10$PUAehJRPGkF9HUbahdC7R.';
exports.registrarUsuario = async (req, res) => {
    let { nombre, email, passwd, role } = req.body;
    let hash = bcrypt.hashSync(passwd, salt);

    const nuevoUser = Users.create({
        nombre,
        email, 
        passwd: hash,
        role
    })
    .then( usuario => {
        res.redirect('/_admin?contenido=panel-usuarios');
    })
    .catch( err => console.log(err) );
}

/**
 * Obtener los usuarios de la base de datos para mostrarlos
 */
async function getUsuarios(){
    return await Users.findAll({});
}