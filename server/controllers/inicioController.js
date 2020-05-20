const Post  = require('../models/Posts');
const Users = require('../models/Users');
const { Op } = require("sequelize");

exports.mostrarPosts = async (req, res) => {
    if (req.query != '' ) {
        console.log(req.query);
        //filtarPosts(req, res)
    }
    const entradas = await Post.findAll({
        order: [
            ['id', 'DESC']
            ]
        })
        
        //Buscamos todos los eventos
        let allEventos = entradas.filter( entrada => entrada.es_evento == true);
        let eventos = [];
        if (allEventos.length > 0 )
            allEventos.forEach((evento, index) => {
                let fechaEvento = new Date(evento.fecha_evento)
                let fechaExpClase = new Date(new Date(fechaEvento).setDate(fechaEvento.getDate() + 1));
                let fechaExpBorrar = new Date(new Date(fechaEvento).setDate(fechaEvento.getDate() + 5));
                //Comparamos el evento para saber si ya ha expirado
                if ( fechaEvento < fechaExpClase ) {
                    evento.clase = "tachado";
                }
                //Si ha pasado más de 5 días, lo añadimos a nuestro eventos[] para despues borrarlo
                if ( fechaEvento < fechaExpBorrar) {
                   eventos.push(evento);
                }
            })
        // Comprobamos los eventos caducados de mas de 5 dias para no mostrarlos.
        eventos = eventos.filter(val => !allEventos.includes(val));

        // Le decimos a Sequalize que las tablas tienen relacion
        Users.belongsTo(Post, { foreignKey: 'id'});
        //Buscamos el autor del post por el %id_autor%
        const autor = await Users.findOne(
            {
                include: Post,
                through: { attributes:['id_autor'] }
            })
    
        res.render('index', {
            pagina: "Bienvenidos a Deifontes",
            entradas,
            eventos,
            autor: autor.nombre,
            usuario: req.user
        })
}

const getAutor = async () => {
    Users.belongsTo(Post, { foreignKey: 'id'});
    return await Users.findOne(
        {
            include: Post,
            through: { attributes:['id_autor'] }
        })
}

const filtarPosts = async (req, res) => {
    console.log('siiiiiiiiiiiiiii');
    
    let autor;
    (async () => {
        autor = await getAutor()
    })()
    
    const Allentradas = await Post.findAll({
        order: 
            [
                ['id', 'DESC'],
            ],
        where: 
            {
                categoria: 
                {
                    [Op.like]: '%' + req.params.categoria + '%'
                }
            }
        })
        .then ( entradas => {
           res.render('index', {
                pagina: "Bienvenidos a Deifontes",
                entradas,
                eventos: {},
                autor: autor.nombre,
                usuario: req.user
            })
        })
}