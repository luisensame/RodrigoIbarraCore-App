'use strict';

// Daos
const favoritoDao = require('../dao/favorito.dao');

module.exports = {

	/**
	 * Funcion que obtiene el total de productos favoritos de un usuario
	 * @param  {String}   email    del usuario a obtener
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	obtenerTotalFavoritos: function(email, callback) {

		// Se invoca al dao
		favoritoDao.obtenerTotalFavoritos(email, (result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que registra un producto como favorito
	 * @param  {Object}   favorito    informacion para registrar un producto como favorito
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	registrarFavorito: function(favorito, callback) {

		// Se invoca al dao
		favoritoDao.registrarFavorito(favorito, (result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que verifica si existe un favorito ya agregado
	 * @param  {Object}   favorito    iformacion a buscar
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	verificarProductoFavorito: function(favorito, callback) {

		// Se invoca al dao
		favoritoDao.verificarProductoFavorito(favorito, (result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que obtiene los productos
	 * @param  {Object}   favorito    iformacion a buscar
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	obtenerFavoritos: function(favorito, callback) {

		// Se invoca al dao
		favoritoDao.obtenerFavoritos(favorito, (result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que obtiene los productos
	 * @param  {Object}   favorito    iformacion a buscar
	 * @param  {Function} callback encapsula el resultado de la consulta del modelo	 
	 */
	eliminarFavorito: function(idUsuario, callback) {

		// Se invoca al dao
		favoritoDao.eliminarFavorito(idUsuario, (result) => {
			callback(result);
		});
	},

	eliminarFavoritoPorId: function(id, callback) {

		// Se invoca al dao
		favoritoDao.eliminarFavoritoPorId(id, (result) => {
			callback(result);
		});
	}
};