const Post    = require('../models/Posts');
const Users = require('../models/Users');

exports.mostrarPost = async (req, res) => {
    let titulo = "";
    if(req.query.titulo) titulo = req.query.titulo;    

    //Relacionamos las tablas
    Users.hasMany(Post, { foreignKey: 'id_autor'} )
    Post.belongsTo(Users, { foreignKey: 'id_autor'});
    let url = req.protocol + '://' + req.get('host') + req.originalUrl;

    const post = await Post.findByPk(req.params.id, {include: [Users]})
    res.render('post/index', {
        pagina: titulo,
        post,
        usuario: req.user,
        url
    })
}

exports.paginaPost = (req, res) => {
    let titulo = "";

    if (req.query.titulo) titulo = req.query.titulo;
        else titulo = "Crear nueva publicación 📝"
    res.render('admin', {
        pagina: titulo,
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