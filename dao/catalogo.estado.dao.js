'use strict';

// Modelos
const catalogoEstadoModel = require('../models/catalogo.estado');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'catalogo.estado.dao > ';

module.exports = {        
    findAll: function (callback) {
        let query = catalogoEstadoModel.find();        
        query.exec((err, catalogo) => {
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error findAll: ', err);
                return callback({success: false, err: err});
            }
            return callback({success: true, catalogo: catalogo});
        });
    },
};