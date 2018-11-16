'use strict';

const mongoose = require('mongoose');

// Modelos
const reseniaModel = require('../models/resenia');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'resenia.dao > ';

module.exports = {		
	/**
	 * Funcion que registra una nueva reseña de un producto
	 * @param  {Resenia}   resenia  contiene la informacion del producto, usuario y calificacion otorgada al producto
	 * @param  {Function} callback Encapsula la informacion de la operacion	 
	 */
	registrar: function (resenia, callback){
		let insertResenia = reseniaModel(resenia);
			insertResenia.save((err, _resenia) => {
				if (err) {
					log.error(fileJS, 'Error registrar: ', err);
					return callback({success: false, err: err, message: 'Error al registrar reseña del producto'});
				}
				return callback({success: true, message: 'Reseña de producto registrada exitosamente'});
			});
	},

	cambiarEstatusResenia: function(idUsuario, callback) {

	 	let query = reseniaModel.update({usuario: idUsuario}, {$set: {estatusResenia: 2}}, { multi: true });
        query.exec((err) => {

            // Se verifica si ocurrio un error
            if(err) {
            	log.error(fileJS, 'Error cambiarEstatusResenia: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
	},

	obtenerListaReseniaPorId: function(idProducto, offset, noElementos, callback) {

		let query = reseniaModel.find().and([{producto: idProducto}, {estatusResenia: 1}])
		.skip(offset).populate('usuario').limit(noElementos).sort({'fechaRegistro': -1});
        query.exec((err, listaResenia) => {

            // Se verifica si ocurrio un error
            if(err) {
            	log.error(fileJS, 'Error obtenerListaReseniaPorId: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, listaResenia: listaResenia});
        });
	}
};