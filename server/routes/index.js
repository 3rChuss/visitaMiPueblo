const   express     = require('express'),
        router      = express.Router(),
    passport        = require('passport');

//Traemos los controladores
const   inicioC     = require('../controllers/inicioController'),
        postsC      = require('../controllers/postsController'),
        paginasC    = require('../controllers/paginasController'),
        adminC      = require('../controllers/adminController');

// MiddleWare
const   Auth        = require('../middleware/auth');


module.exports = function() {

    // Posts
    router.get('/', inicioC.mostrarPosts);
    router.get('/post/:id', postsC.mostrarPosts);
    router.get('/nuevo-post', postsC.paginaPost);
    router.post('/nuevo-post', postsC.nuevoPost);

    // Páginas estáticas
    router.get('/deifontes', paginasC.paginaDeifontes);
    router.get('/deifontes/:pagina', paginasC.paginaID);
    router.get('/que-ver', paginasC.paginaQuever);
    router.get('/fiestas', paginasC.paginaFiestas);
    router.get('/fiestas/:pagina', paginasC.paginaIDFiesta);

    //Usuarios
    //router.get('/login', usersC.login);
    router.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/_admin',
        failureRedirect: '/#login?status=FAILURE'
    }));

    //Admin
    router.get('/_admin', adminC.adminPanel);
    //router.get('/_admin', Auth.isLoggedIn, adminC.adminPanel);

    return router;
}
