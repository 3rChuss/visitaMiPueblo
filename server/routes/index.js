const   express     = require('express'),
        router      = express.Router(),
    passport        = require('passport');

//Traemos los controladores
const   inicioC     = require('../controllers/inicioController'),
        postsC      = require('../controllers/postsController'),
        paginasC    = require('../controllers/paginasController'),
        adminC      = require('../controllers/adminController'),
        usersC      = require('../controllers/userControllers'),
        serverC     = require('../controllers/serverController');

// MiddleWare
const   Auth        = require('../middleware/auth');


module.exports = function() {
    //Todo sobre https
    //router.all('*', ensureSecure)

    // Posts
    router.get('/', inicioC.mostrarPosts);
    router.get('/post/:id', postsC.mostrarPost);
    router.get('/post/:id/edit', Auth.isLoggedIn, postsC.editarPost);
    router.get('/nuevo-post', postsC.paginaPost);
    router.post('/nuevo-post', postsC.nuevoPost);
    router.post('/post/:id/guardar-post', Auth.isLoggedIn, postsC.guardarEditPost);

    // Páginas estáticas
    router.get('/politica-privacidad', paginasC.paginaPoliticaPrivacidad);
    router.get('/deifontes', paginasC.paginaDeifontes);
    router.get('/deifontes/:pagina', paginasC.paginaID);
    router.get('/que-ver', paginasC.paginaQuever);
    router.get('/fiestas', paginasC.paginaFiestas);
    router.get('/fiestas/:pagina', paginasC.paginaIDFiesta);

    //Usuarios
    router.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/_admin',
        failureRedirect: '/#login?status=FAILURE'
    }));

    //Admin
    router.get('/_admin', Auth.isLoggedIn, adminC.adminPanel);
    router.post('/registrar', Auth.isLoggedIn, adminC.registrarUsuario)
    router.get('/salir', usersC.salir);

    //Push Notifications
    router.post('/api/save-subcription/', serverC.saveSubscription);
    router.post('/api/trigger-push-msg/', serverC.triggerPushMessage);

    return router;
}
