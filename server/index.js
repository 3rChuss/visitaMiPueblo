// Importaciones
const       express = require('express'),
            app     = express(),
            routes  = require('./routes'),
        bodyParser  = require('body-parser'),
        passport    = require('passport'),
            path    = require('path'),
            flash   = require('connect-flash'),
            configs = require('./config'),
            db      = require('./config/database'),
            moment  = require('moment'),
        compression = require('compression'),

        // Models
            User    = require('./models/Users');

//Variables locales
require('dotenv').config({ path: 'variables.env' });

// Inicializar Base de datos
    db.authenticate()
        .then( () => console.log('DB Conectada'))
        .catch( error => console.log(error))

// Configurar Express
    // Habilitar Pug
    app.set('view engine', 'pug');
    // Views
    app.set('views', path.join(__dirname, './views'));
    // Archivos estaticos
    app.use(express.static('public', {
        etag: true, // Just being explicit about the default.
        lastModified: true,  // Just being explicit about the default.
        setHeaders: (res, path) => {
            const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.');
            if (path.endsWith('.html')) {
                // All of the project's HTML files end in .html
                res.setHeader('Cache-Control', 'no-cache');
            } else if (hashRegExp.test(path)) {
                // If the RegExp matched, then we have a versioned URL.
                res.setHeader('Cache-Control', 'max-age=31536000');
            }
        },
    }));
    

    // Validar si estamos en desarrollo o en produccion
    const config =  configs[app.get('env')]

    //Inicializamos la compresion gzip
    app.use(compression());

    // Inicializamos bodyParser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //Inicializamos passport y express sessions
    app.use(require('express-session')({
        secret: 'Hola Deifontes!',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Inicializamos Flahs
    app.use(flash());
    // Creamos la variable para el sitio web
    app.locals.titulo =  config.nombreSitio;
    // Mostrar año actual y las rutas para los menus
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash('error');
        res.locals.mensaje = req.flash('mensaje');
        moment.locale('es');
        res.locals.fechaActual = moment().format('LLL');
        res.locals.anio = new Date().getFullYear();
        res.locals.ruta =  req.path;
        return next();
    })
    
    // Cargar las rutas
    app.use('/', routes());
    require('./config/passport')(passport, User)

// Servidor
    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.PORT || 3000;

    app.listen(port, host, () => {
        console.log('Servidor funcionando')
        console.log(port + ' : ' + host);
    });
