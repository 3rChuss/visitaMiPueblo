const Post  = require('../models/Posts');
const Users = require('../models/Users');
const { Op } = require("sequelize");

exports.mostrarPosts = async (req, res) => {
    //Relacionamos las tablas
    Users.hasMany(Post, { foreignKey: 'id_autor'} )
    Post.belongsTo(Users, { foreignKey: 'id_autor'});
    let filtro = '';
    let entradas = '';
    //Si viene un query
    
    if (req.query.f) {
        entradas = await Post.findAll({
            order: [ ['id', 'DESC'] ],
            where: { categoria: { [Op.like]: '%' + req.query.f + '%' } },
            include: [Users]
            })
        filtro = req.query.f
        if (entradas.length === 0) res.redirect('back')
            
    } else {
        entradas = await Post.findAll({
            order: [ ['id', 'DESC'] ],
            include: [Users]
            })
        filtro = '';
    }
        
    //Buscamos todos los eventos
    let allEventos = entradas.filter( entrada => entrada.es_evento == true);
    let eventos = [];
    if (allEventos.length > 0 )
        allEventos.forEach((evento, index) => {
            let fechaEvento = new Date(evento.fecha_evento)
            let fechaExpClase = new Date(new Date(fechaEvento).setDate(fechaEvento.getDate() + 1));
            let fechaExpBorrar = new Date(new Date(fechaEvento).setDate(fechaEvento.getDate() + 5));
            //Comparamos el evento para saber si ya ha expirado
            if ( fechaExpClase < new Date()) {
                evento.clase = "tachado";
            }
            //Si no ha pasado más de 5 días, lo añadimos a nuestro eventos[] para mostrarlo
            if ( (fechaEvento < fechaExpBorrar) && fechaExpBorrar > new Date() ) {   
                eventos.push(evento);
            }
        })

    res.render('index', {
        pagina: "Bienvenidos a Deifontes",
        entradas,
        eventos,
        usuario: req.user,
        filtro
    })
}

const getEntradas = async () => {
    return await Post.findAll({
        order: [
            ['id', 'DESC']
            ]
        })
}

const getAutor = async () => {
    Users.belongsTo(Post, { foreignKey: 'id'});
    return Users.findOne(
        {
            include: Post,
            through: { attributes:['id_autor'] }
        })
        .then( autor => { return autor; });
}

const getEntradasFiltradas = async () => { 
    return await Post.findAll({
        order: [ ['id', 'DESC'] ],
        where: { categoria: { [Op.like]: '%' + req.params.categoria + '%' } }
        })
}