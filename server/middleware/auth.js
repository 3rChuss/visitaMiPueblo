const   Posts   =   require('../models/Posts');

const   auth  =   {};

auth.esPropietario = async (req, res, next) => {
    if (req.user) {
        const post = Posts.findByPk(req.params.id)
            .then(entrada => {
                next();
            })
            .catch(err => console.log(err));
    }else{
        res.redirect('/#login')
    }
}

auth.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#login');
}


module.exports = auth;