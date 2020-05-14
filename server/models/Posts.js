const   Sequelize   =   require('sequelize'),
                db  =   require('../config/database');


const   Post = db.define('_posts', {
    titulo: {
        type: Sequelize.STRING
    },
    subtitulo: {
        type: Sequelize.STRING
    },
    img_url: {
        type: Sequelize.STRING
    },
    html: {
        type: Sequelize.STRING
    },
    es_evento: {
        type: Sequelize.BOOLEAN
    },
    fecha_evento: {
        type: Sequelize.DATE
    },
    fecha_entrada: {
        type: Sequelize.DATE
    },
    autor: {
        type: Sequelize.STRING
    }
})

module.exports = Post;