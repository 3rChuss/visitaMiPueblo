const   Sequelize   =   require('sequelize'),
                db  =   require('../config/database');

                
const Subscriptions = db.define('_subscriptions', {
    content: {
        type: Sequelize.TEXT
    }
})

module.exports = Subscriptions;