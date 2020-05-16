const Post  = require('../models/Posts');
const Users = require('../models/Users');

exports.mostrarPosts = async (req, res) => {
    
    const entradas = await Post.findAll({
        order: [
            ['id', 'DESC']
            ]
        })
    console.log(entradas);
    
        let eventos = entradas.filter( entrada => entrada.es_evento == true);
            eventos.forEach(evento => {
                let fechaEvento = new Date(evento.fecha_evento)
                let fechaExp = new Date(new Date(fechaEvento).setDate(fechaEvento.getDate() + 15));
                if ( fechaEvento < fechaExp ) {
                    evento.clase = "tachado";
                }
            }
        )
    
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