'use strict';

// Modelos
const usuarioModel = require('../models/usuario');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'usuario.dao > ';

module.exports = {

	/**
	* Funcion que accede al modelo de datos para obtener un objeto usuario por email
	* @param  {String}   email    del usuario a obtener
	* @param  {Function} callback encapsula el resultado de la consulta del modelo  
	*/
	buscarPorEmail: function (email, callback) {
		
		let query = usuarioModel.findOne({email: email});

		//query.select('nombreCompleto apellidos email imagen fechaRegistro idOrigen');
		query.exec((err, usuario) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error buscarPorEmail: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, usuario: usuario});
		});
	},

	/**
	* Funcion que accede al model para registrar a un nuevo usuario
	* @param  {Object}   usuario  informacion del usuario a registrar
	* @param  {Function} callback encapsula el resultado de la consulta del modelo
	*/
	registrarUsuario: function(usuario, callback) {

		let query = new usuarioModel(usuario);
		query.save((err) => {

			// Se verifica si ocurrio un error
			if(err) {
				log.error(fileJS, 'Error registrarUsuario: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true});
		});
	},

	/**
	* Funcion que actualiza la contrasenia de un usuario
	* @param  {usuario}   informacion del usuario
	* @param  {Function} callback encapsula el resultado de la consulta del modelo
	*/
	actualizarContrasenia: function(usuario, callback) {

		let query = usuarioModel.findOneAndUpdate({email: usuario.email}, usuario);
		query.exec((err) => {

			// Se verifica si ocurrio un error
			if(err) {
				log.error(fileJS, 'Error actualizarContrasenia: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true});
		});
	},

	/**
	* Funcion que actualiza los datos del usuario
	* @param  {Strig}   email  del usuario
	* @param  {Function} callback encapsula el resultado de la consulta del modelo
	*/
	actualizarInformacion: function(usuario, callback) {

		let query = usuarioModel.findOneAndUpdate({email: usuario.email}, usuario);
		query.exec((err) => {

			// Se verifica si ocurrio un error
			if(err) {
				log.error(fileJS, 'Error actualizarInformacion: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true});
		});
	},
    /**
     * Funcion que elimina la cuenta de un usuario
     * @param  {Object}   usuario     Informacion del usuario a actualizar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    eliminarCuentaUsuario: function(usuario, callback) {

       let query = usuarioModel.update({email: usuario.email}, usuario);
		query.exec((err) => {

			// Se verifica si ocurrio un error
			if(err) {
				log.error(fileJS, 'Error eliminarCuentaUsuario: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true});
		});
    },
    /**
     * Funcion que activa la cuenta de un usuario
     * @param  {Object}   usuario     Informacion del usuario a actualizar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    activarCuentaUsuario: function(usuario, callback) {

       let query = usuarioModel.findOneAndUpdate({email: usuario.email}, usuario);
		query.exec((err) => {

			// Se verifica si ocurrio un error
			if(err) {
				log.error(fileJS, 'Error activarCuentaUsuario: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true});
		});
    }
};