'use strict';

// Modelos
const catalogoMetodoPagoModel = require('../models/catalogo.metodo.pago');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'catalogo.metodo.pago.dao > ';

module.exports = {        
    findAll: function (callback) {
        let query = catalogoMetodoPagoModel.find();        
        query.exec((err, catalogo) => {
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error findAll: ', err);
                return callback({success: false, err: err});
            }
            return callback({success: true, catalogo: catalogo});
        });
    },
    obtenerMetodoPagoPorId: function(idMetodoPago, callback) {

        let query = catalogoMetodoPagoModel.find({identificador: idMetodoPago});
        query.exec((err, metodoPago) => {
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error obtenerMetodoPagoPorId: ', err);
                return callback({success: false, err: err});
            }
            return callback({success: true, metodoPago: metodoPago[0] || metodoPago});
        });
    }
};