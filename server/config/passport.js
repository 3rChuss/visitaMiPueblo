const passport  =   require('passport'),
       bcrypt   =   require('bcryptjs'),
  LocalStrategy =   require('passport-local').Strategy,
UserController  =   require('../controllers/userControllers');


 const salt = '$2a$10$PUAehJRPGkF9HUbahdC7R.';

module.exports = function (passport, user) {
    let User = user;

    passport.use('local-signin', new LocalStrategy (
        {
            usernameField: 'email',
            passwordField: 'passwd',
            passReqToCallback: true

        }, (req, email, passwd, done) => {
            let isValidPswd = (userpass, passwd) => { return bcrypt.compareSync(passwd, userpass) };
            
            User.findOne({
                where: {
                    email
                }
            }).then( usuario => {
                //console.log(usuario);
                
                if (!usuario){
                    return done(null, false, {
                        mensaje: 'Email o contraseña no válidos'
                    })
                }
                if (!isValidPswd(usuario.passwd, passwd)){
                    return done(null, false, {
                        mensaje: 'Email o contraseña no válidos'
                    })
                }

                let userInfo = usuario.get();
                return done(null, userInfo);

            }).catch(err => {
                console.log(err);
                return done(null, false, {
                    mensaje: 'Algo no va bien :/'
                })
            })
        }
    ));

    passport.serializeUser((user, done) =>{
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then(user => {
                if(user) done(null, user.get())
                else done(user.errors, null);
            })
    });


  }
