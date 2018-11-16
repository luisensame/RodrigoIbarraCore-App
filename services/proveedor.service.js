'use strict';

// Daos
const proveedorDao = require('../dao/proveedor.dao');

// Libs
const moment = require('moment');

module.exports = {
    
    registrar: function(proveedor, callback) {
        // Se invoca al metodo para buscar al proveedor
        proveedorDao.buscarPorEmail(proveedor.email, (resultSearch) => {
            // Se verifica si no hay un error
            if(!resultSearch.err && resultSearch.success) {
                // Se verifica si el proveedor existe
                if(!resultSearch.proveedor) {
                    // Se recupera la fecha actual
                    proveedor.fechaRegistro = moment().format('YYYY/MM/DD HH:mm:ss');
                    proveedor.representante.fechaRegistro = moment().format('YYYY/MM/DD HH:mm:ss');
                    // Se invoca al metodo de registro
                    proveedorDao.registrar(proveedor, (result) => {
                        callback(result);
                    });
                } else {
                    callback({success: false, message: 'Proveedor existente'});
                }
            } else {
                callback(resultSearch);//send result of dao
            }
        });
    },

    buscarPorEmail: function (email, callback){        
        proveedorDao.buscarPorEmail(email, (result) => {            
            callback(result);
        });
    },

    findAll: function(callback) {    
        proveedorDao.findAll(function (result){
            callback(result);
        });
    },

    findById: function(id, callback) {
        proveedorDao.findById(id, function (result){            
            callback(result);
        });
    },

    findByIdAndUpdate: function (proveedor, callback){
        proveedorDao.findByIdAndUpdate(proveedor, function(result) {
            callback(result);
        });
    }
};