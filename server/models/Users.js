const   Sequelize   =   require('sequelize'),
                db  =   require('../config/database');

const User = db.define('_users', {
    nombre: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    passwd: {
        type: Sequelize.STRING
    }
});

module.exports = User;