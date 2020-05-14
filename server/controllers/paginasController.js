const   path    = require('path'),
        fs      = require('fs');

exports.paginaDeifontes= (req, res) => {
    res.render('deifontes/info', {
        pagina: 'Fuente de dios'
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
                imagenes
            });
        })
    }else {
        res.render('deifontes/'+req.params.pagina, {
            pagina
        });
    }
}

exports.paginaQuever = (req, res) => {
    res.render('quever', {
        pagina: 'Lo que deifontes esconde'
    });
}

exports.paginaFiestas = (req, res) => {
    res.render('fiestas/', {
        pagina: 'Fiestas y tradiciones'
    })
}

exports.paginaIDFiesta = (req, res) => {
    res.render('fiestas/'+req.params.pagina, {
        pagina: 'Fiestas y tradiciones'
    })
}