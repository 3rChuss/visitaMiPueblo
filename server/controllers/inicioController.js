const Post    = require('../models/Posts');
exports.mostrarPosts = async (req, res) => {
    
    const entradas = await Post.findAll({
        order: [
            ['id', 'DESC']
            ]
        })

        let eventos = entradas.filter( entrada => entrada.es_evento == true);
            eventos.forEach(evento => {
                let fechaEvento = new Date(evento.fecha_evento)
                let fechaExp = new Date(new Date(fechaEvento).setDate(fechaEvento.getDate() + 15));
                if ( fechaEvento < fechaExp ) {
                    evento.clase = "tachado";
                }
            }
        )
        res.render('index', {
            pagina: "Bienvenidos a Deifontes",
            entradas,
            eventos
        })
}