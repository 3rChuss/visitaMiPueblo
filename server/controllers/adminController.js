
exports.adminPanel = (req, res) => {
    let contenido = req.query.contenido;
    let usuario = req.user;
   
    res.render('admin', {
        pagina: 'Panel de control',
        contenido,
        usuario
    })
}