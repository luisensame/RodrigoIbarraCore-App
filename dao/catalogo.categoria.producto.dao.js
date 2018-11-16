'use strict';

// Modelos
const catalogoCategoriaProductoModel = require('../models/catalogo.categoria.producto');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kouamx'),
    fileJS = 'catalogo.categoria.producto.dao > ';

module.exports = {
        
    find: function (callback) {
        let query = catalogoCategoriaProductoModel.find();
        //query.select('nombreEmpresa direccion email telefono fechaRegistro');
        query.exec((err, catalogo) => {            
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error find: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, catalogo: catalogo});
        });
    },
    findAllFathers: function (callback) {
        let query = catalogoCategoriaProductoModel.find({"tipo": 'padre'});
        //query.select('nombreEmpresa direccion email telefono fechaRegistro');
        query.exec((err, catalogo) => {            
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error find: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, catalogo: catalogo});
        });
    },
    findAllChildrensByFather: function (id_proveniente, callback) {
        let query = catalogoCategoriaProductoModel.find({$and: [{"tipo": 'hijo'}, {"id_proveniente": id_proveniente}]});
        //query.select('nombreEmpresa direccion email telefono fechaRegistro');
        query.exec((err, catalogo) => {            
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error find: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, catalogo: catalogo});
        });
    },
    findAllGrandSonByFather: function (id_proveniente, callback) {
        let query = catalogoCategoriaProductoModel.find({$and: [{"tipo": 'nieto'}, {"id_proveniente": id_proveniente}]});
        //query.select('nombreEmpresa direccion email telefono fechaRegistro');
        query.exec((err, catalogo) => {            
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error find: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, catalogo: catalogo});
        });
    }
};