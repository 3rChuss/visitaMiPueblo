const   path    = require('path'),
        fs      = require('fs');

exports.paginaDeifontes= (req, res) => {
    res.render('deifontes/info', {
        pagina: 'Fuente de dios',
        usuario: req.user
    });
}

exports.paginaID = (req, res) => {
    let pagina = req.params.pagina.charAt(0).toUpperCase() + req.params.pagina.slice(1);

    if (req.params.pagina === "galeria"){
        let dir = path.join(__dirname, '../../public/img/galeria/');            
        fs.readdir(dir, (err, imagenes) => {
            if (err) console.log(err)
            res.render('deifontes/'+req.params.pagina, {
                pagina,
                imagenes,
                usuario: req.user
            });
        })
    }else {
        res.render('deifontes/'+req.params.pagina, {
            pagina,
            usuario: req.user
        });
    }
}

exports.paginaQuever = (req, res) => {
    res.render('quever', {
        pagina: 'Lo que deifontes esconde',
        usuario: req.user
    });
}

exports.paginaFiestas = (req, res) => {
    res.render('fiestas/', {
        pagina: 'Fiestas y tradiciones',
        usuario: req.user
    })
}

exports.paginaIDFiesta = (req, res) => {
    res.render('fiestas/'+req.params.pagina, {
        pagina: 'Fiestas y tradiciones',
        usuario: req.user
    })
}

exports.paginaPoliticaPrivacidad = (req, res) => {
    res.render('privacidad', {
        pagina: 'Política de privacidad y Cookies'
    })
}