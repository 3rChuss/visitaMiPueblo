
exports.adminPanel = (req, res) => {
    let contenido = req.query.contenido;
    let user = req.user;
   
    res.render('admin', {
        pagina: 'Panel de control',
        contenido,
        nombre: user.nombre
    })
}