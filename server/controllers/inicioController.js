const Post  = require('../models/Posts'),
     Users  = require('../models/Users'),
     { Op } = require("sequelize"),
     path   = require('path'),
     fs     = require('fs');


exports.mostrarPosts = async (req, res) => {
    //Relacionamos las tablas
    Users.hasMany(Post, { foreignKey: 'id_autor'} )
    Post.belongsTo(Users, { foreignKey: 'id_autor'});
    let filtro = '';
    let entradas = '';

    //Si viene un query para filtrar los posts
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

    //Inicializamos el slider con las fotos que estén en la carpeta
    let imagenes = getSliderImgs()
    imagenes.then(sliderImgs => {
        
        //Obtenemos los nombres y borramos los duplicados
        let imgs = [... new Set(sliderImgs.map(img => img.replace(/\.[^/.]+$/, "")))];
        
        res.render('index', {
            pagina: "Bienvenidos a Deifontes",
            entradas,
            eventos,
            usuario: req.user,
            filtro,
            imgs
        })
    }).catch(err => {
        console.log('[InicioController] La carpeta Slider no se encuetra');
        //Renderizamos sin imagenes
        res.render('index', {
            pagina: "Bienvenidos a Deifontes",
            entradas,
            eventos,
            usuario: req.user,
            filtro
        })
    })
}

const getSliderImgs = () => {
    let dir = path.join(__dirname, '../../public/img/slider/');
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, imgs) => {
            if (err) reject(err)
            else resolve(imgs)
        })
    })
}
