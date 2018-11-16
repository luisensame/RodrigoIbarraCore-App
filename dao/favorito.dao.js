'use strict';

// Modelos
const favoritoModel = require('../models/favorito');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'favorito.dao > ';

module.exports = {

	/**
	 * Funcion que obtiene el total de productos favoritos de un usuario
	 * @param  {String}   email    del usuario a obtener
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	obtenerTotalFavoritos: function(email, callback) {

		// Se ejecuta la consulta
		let query = favoritoModel.count().and([{email: email, estatusFavorito: 1}]);
        
        //query.select('nombreCompleto apellidos email imagen fechaRegistro idOrigen');
        query.exec((err, total) => {

            // Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerTotalFavoritos: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, total: total});
		});
	},

	/**
	 * Funcion que registra un producto como favorito
	 * @param  {Object}   favorito    informacion para registrar un producto como favorito
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	registrarFavorito: function(favorito, callback) {

		let query = new favoritoModel(favorito);
        query.save((err) => {
            
            // Se verifica si ocurrio un error
            if(err) {
            	log.error(fileJS, 'Error registrarFavorito: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
	},

	/**
	 * Funcion que verifica si existe un favorito ya agregado
	 * @param  {Object}   favorito    iformacion a buscar
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	verificarProductoFavorito: function(favorito, callback) {

		const params = [
			{estatusFavorito: 1},
			{email: favorito.email},
			{producto: favorito.producto}
		];

		let query = favoritoModel.find().and(params);
        query.exec((err, resultFavorito) => {
            
            // Se verifica si ocurrio un error
            if(err) {
            	log.error(fileJS, 'Error verificarProductoFavorito: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, favorito: resultFavorito});
        });
	},

	/**
	 * Funcion que obtiene los productos
	 * @param  {Object}   favorito    iformacion a buscar
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	obtenerFavoritos: function(favorito, callback) {

		let query = favoritoModel.find().and([{email: favorito.email, estatusFavorito: 1}])
		.populate('producto').skip(favorito.offSet).limit(favorito.noElementos);

		query.exec((err, favoritos) => {

			// Se verifica si ocurrio un error
			if(err) {
				log.error(fileJS, 'Error obtenerFavoritos: ', err);
				return callback({success: false, err: err});
            }

            return callback({success: true, favoritos: favoritos});
		});
	},

	/**
	 * Funcion que obtiene los productos
	 * @param  {Object}   favorito    iformacion a buscar
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	eliminarFavorito: function(email, callback) {

		let query = favoritoModel.update({email: email}, {$set: {estatusFavorito: 2}}, { multi: true });
        query.exec((err) => {

            // Se verifica si ocurrio un error
            if(err) {
            	log.error(fileJS, 'Error eliminarFavorito: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
	},

	eliminarFavoritoPorId: function(id, callback) {

		console.log('id', id);

		let query = favoritoModel.findByIdAndRemove({_id: id});
        query.exec((err) => {

            // Se verifica si ocurrio un error
            if(err) {
            	log.error(fileJS, 'Error eliminarFavoritoPorId: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
	}
};