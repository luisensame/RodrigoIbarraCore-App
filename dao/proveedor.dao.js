'use strict';

const mongoose = require('mongoose');

// Modelos
const proveedorModel = require('../models/proveedor');
const representanteModel = require('../models/representante');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'proveedor.dao > ';

/**
 * funcion que realiza rollback sobre documentos concatenados
 * @param  {Array} docs coleccion de modelos y documentos a deshacer
 * @return {Funcion}      callback function
 */
function rollback(docs, callback){
    //console.log('rollback docs: ', docs);
    if (!docs) { callback(); }
    else {
        for(let i in docs){            
            console.log('doc for: ', docs[i]);
            docs[i]['modelo'].findByIdAndRemove(docs[i]['doc']._id, function (err, _doc) {
              console.log('Rolled-back document: ', _doc);
              callback();
            });
        }
    }
}

module.exports = {

    /**
     * Funcion que registra un proveedor
     * @param  {Proveedor}   proveedor object
     * @param  {Function} callback  Funcion de retorno con el resultado obtenido
     */
    registrar: function(proveedor, callback) {
        
        //almacenara los documentos que se van registrando
        let docs = [];

        let insertRepresentante = new representanteModel(proveedor.representante);
            insertRepresentante.save((err, representante) => {
                if (err) {
                    log.error(fileJS, 'Error registrar: ', err);
                    return callback({success: false, message: 'Error al registrar representante', err: err});
                }

                //save doc in docs array
                docs.push({modelo: representanteModel, doc: representante});

                //call insert to proveedor
                proveedor.representante = representante._id;                
                let insertProveedor = new proveedorModel(proveedor);
                    insertProveedor.save((error) => {                        
                        if (error) {
                            log.error(fileJS, 'Error insertProveedor.save: ', error);
                            //Se elimina el documento de representante recien registrado
                            rollback(docs, () =>{});
                            return callback({success: false, message: 'Error al registrar proveedor', err: error});
                        }

                        return callback({success: true, message: 'Registro de proveedor exitoso'});
                    });
            });//fin insert representante
    },

    /**
     * Funcion que accede al modelo de datos para obtener un objeto proveedor por email
     * @param  {String}   email    del proveedor a obtener
     * @param  {Function} callback encapsula el resultado de la consulta del modelo
     */
    buscarPorEmail: function (email, callback) {
        let query = proveedorModel.findOne({email: email}).populate('representante');
        //query.select('nombreEmpresa direccion email telefono fechaRegistro');
        query.exec((err, proveedor) => {            
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error buscarPorEmail: ', err);
                return callback({success: false, message: 'Error al consultar proveedores', err: err});
            }

            return callback({success: true, proveedor: proveedor});
        });
    },

    /**
     * Funcion que obtiene una coleccion de proveedores     
     */
    findAll: function (callback){
        let query = proveedorModel.find();
        query.select('nombreEmpresa direccion email telefono fechaRegistro');
        query.exec((err, proveedores) => {
            if (err) {
                log.error(fileJS, 'Error findAll: ', err);
                return callback({success: false, message: 'Error al consultar proveedores', err: err});
            }            

            return callback({success: true, proveedores: proveedores});
        });
    },

    /**
     * Funcion que obtiene la informacion de un proveedor por id
     * @param  {Strin}   id       del proveedor
     * @param  {Function} callback Funcion de retorno para el resultado     
     */
    findById: function (id, callback){
        let secureIdProveedor = (mongoose.Types.ObjectId.isValid(id)) ? id : '123456789012';
        let query = proveedorModel.findById(secureIdProveedor).populate('representante');
        query.exec((err, proveedor) => {            
            if (err) {                
                log.error(fileJS, 'Error findById: ', err);
                return callback({success: false, err: err, message: 'Error al consultar proveedor por id'});
            }            
            return callback({success: true, message: 'Query exitosa', proveedor: proveedor});                    
        });        
    },

    findByIdAndUpdate: function (proveedor, callback){
        representanteModel.findByIdAndUpdate(proveedor.representante['_id'], proveedor.representante, function (err, _representante){
            if (err) {
                log.error(fileJS, 'Error findByIdAndUpdate: ', err);
                return callback({success: false, message: 'Error al actualizar representante', err: err});
            }

            proveedorModel.findByIdAndUpdate(proveedor._id, proveedor, function(errp, _proveedor){
                if (errp) {
                    log.error(fileJS, 'Error findByIdAndUpdate: ', errp);
                    return callback({success: false, message: 'Error al actualizar proveedor', err: errp});
                }
                return callback({success: true, message: 'Proveedor actualizado exitosamente', proveedor: _proveedor});
            });
        });
    }
};