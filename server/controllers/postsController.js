const Post    = require('../models/Posts');
exports.mostrarPosts = async (req, res) => {
    let titulo = "";
    if(req.query.titulo) titulo = req.query.titulo;    

    const post = await Post.findByPk(req.params.id)
    res.render('post/index', {
        pagina: titulo,
        post
    })
}

exports.paginaPost = (req, res) => {
    let titulo = "";
    if (req.query.titulo) titulo = req.query.titulo;
        else titulo = "Crear nueva publicación 📝"
    res.render('admin', {
        pagina: titulo
    });
}

exports.nuevoPost = (req, res) => {
    let { titulo, subtitulo, img_url, es_evento, fecha_evento, html } = req.body;
    let fechaEvento = new Date(fecha_evento).toLocaleDateString();   
    // Comprobar los campos no oblgatorios
    if (!subtitulo) subtitulo = "";
    es_evento == "on" ? es_evento = 1 : es_evento = 0;

    Post.create({
        id_autor: req.user.id,
        titulo,
        subtitulo,
        img_url,
        html,
        es_evento,
        fecha_evento: fechaEvento,
        fecha_entrada: new Date().toLocaleDateString(),
    })
    .then( resumen => res.redirect('/_admin?titulo=Entrada Enviada 👏🏼') )
    .catch( err => console.log(err) )
}