'use strict';

const mongoose = require('mongoose');

// Modelos
const productoModel = require('../models/producto');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('sell-it-app'),
    fileJS = 'producto.dao > ';

module.exports = {

	/**
	 * Funcion que obtiene la lista de productos ordenados por fecha
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerListaProductos: function(offSet, noElementos, callback) {

		let query = productoModel.find({'status': true}).skip(offSet).limit(noElementos).sort({'fechaRegistro': -1});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductos: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
	 * Funcion que obtiene la lista de productos destacados
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerListaProductosDestacados: function(offSet, noElementos, callback) {

		let query = productoModel.find({'status': true}).skip(offSet).limit(noElementos).sort({'visitas': -1});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductosDestacados: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
	 * Funcion que obtiene el total de productos
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerTotalProductos: function(callback) {

		let query = productoModel.count({'status': true});
		query.exec((err, totalRegistros) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerTotalProductos: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, totalRegistros: totalRegistros});
		});
	},

	/**
	 * Funcion que obtiene la lista de productos
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerTotalProductosOferta: function(callback) {

		let query = productoModel.find({$and: [{oferta: true}, {'status': true}]}).count();
		query.exec((err, totalRegistros) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerTotalProductosOferta: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, totalRegistros: totalRegistros});
		});
	},

	/**
	 * Funcion que obtiene la lista de productos en oferta
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerListaProductosOferta: function(offSet, noElementos, callback) {

		let query = productoModel.find({$and: [{oferta: true}, {'status': true}]})
		.skip(offSet).limit(noElementos).sort({'fechaRegistro': -1});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductosOferta: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
	 * Funcion que obtiene la lista de productos por busqueda reciente
	 * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {Array}     listaProducto 	Lista de id de productos
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerListaProductosBusqueda: function(offSet, noElementos, listaProducto, callback) {

		var arrayId = [];
		
		// Se itera la lista
		for(var i = 0; i < listaProducto.length; i++) {
			var secureObjectIdProducto = (mongoose.Types.ObjectId(listaProducto[i])) ? listaProducto[i] : '123456789012';
			arrayId.push(secureObjectIdProducto);
		}

		let query = productoModel.find({$and: [{_id: {$in: arrayId}}, {'status': true}]})
		.skip(offSet).limit(noElementos).sort({'fechaRegistro': -1});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductosBusqueda: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
     * Funcion que obtiene el total de productos por categoria
     * @param  {Integer} idCategoria  categoria a buscar
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerTotalProductosCategoria: function(idCategoria, callback) {

		let secureObjectIdCategoria = (mongoose.Types.ObjectId.isValid(idCategoria)) ? idCategoria : '123456789012';

		let query = productoModel.find({$and: [{categoria: secureObjectIdCategoria}, {'status': true}]}).count();
		query.exec((err, totalRegistros) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerTotalProductosCategoria: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, totalRegistros: totalRegistros});
		});
	},

	/**
	 * Funcion que obtiene la lista de productos por categoria
	 * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {Array}     idCategoria 		id de la categoria
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerListaProductosCategoria: function(offSet, noElementos, idCategoria, callback) {

		let secureObjectIdCategoria = (mongoose.Types.ObjectId.isValid(idCategoria)) ? idCategoria : '123456789012';
		
		let query = productoModel.find({$and: [{categoria: secureObjectIdCategoria}, {'status': true}]}).skip(offSet)
		.limit(noElementos).sort({'fechaRegistro': -1});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductosCategoria: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
	 * Funcion que registra un producto
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	/*registrar: function (producto, callback){
		let query = productoModel.count({'status': true});
		query.exec((err, totalRegistros) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerTotalProductos: ', err);
				return callback({success: false, err: err});
			}else{
				console.log(totalRegistros)
				if (totalRegistros == 2) {
					return callback({success: false, err: err, message: 'El número de productos excede a los permitidos'});
				}else{
					if (totalRegistros < 2) {
						let insertProducto = productoModel(producto);
						insertProducto.save((err, _producto) => {
							if (err) {
								log.error(fileJS, 'Error registrar: ', err);
								return callback({success: false, err: err, message: 'Error al registrar producto'});
							}

							return callback({success: true, message: 'Producto registrado exitosamente'});
						});	
					}
				}
			}
			
		});
	},*/

	registrar: function (producto, callback){
		let insertProducto = productoModel(producto);
		insertProducto.save((err, _producto) => {
			if (err) {
				log.error(fileJS, 'Error registrar: ', err);
				return callback({success: false, err: err, message: 'Error al registrar producto'});
			}

			return callback({success: true, message: 'Producto registrado exitosamente'});
		});		
	},

	/**
	 * Funcion que obtiene todos los productos
	 * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	getAllProductos: function(callback) {

		let query = productoModel.find({status: true}).populate('proveedor', 'nombreEmpresa').sort({'fechaRegistro': -1});
		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error getAllProductos: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
	 * Funcion que obtiene el total de productos mediante una busqueda
	 * @param  {String}   palabra por la que se va a buscar
	 * @param  {Function} callback envia el resultado de la operacion	 
	 */
	obtenerTotalProductosBusqueda: function (palabra, callback) {
		//fields: {type: [String], text: true}
		var condicion = {$text: {$search: palabra, $caseSensitive: false}};
		let query = productoModel.find({$and: [condicion, {'status': true}]}).count();

		query.exec((err, totalRegistros) => {
			console.log(totalRegistros)
			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerTotalProductosBusqueda: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, totalRegistros: totalRegistros});
		});
	},

	/**
	 * Funcion que obtiene los productos mediante una busqueda
	 * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {String}   palabra por la que se va a buscar
	 * @param  {Function} callback envia el resultado de la operacion	 
	 */
	obtenerProductosBusqueda: function (offSet, noElementos, palabra, callback) {

		var condicion = {$text: {$search: palabra, $caseSensitive: false}};
		let query = productoModel.find({$and: [condicion, {'status': true}]}).skip(offSet)
		.limit(noElementos).sort({'fechaRegistro': -1});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerProductosBusqueda: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},
	/**
	 * Funcion que obtiene la informacion de un producto por id
	 * @param  {String}   id       del producto
	 * @param  {Function} callback retorno de la devoluciona de llamada	 
	 */
	obtenerProductoPorId: function (id, callback) {

		let secureIdProducto = (mongoose.Types.ObjectId.isValid(id)) ? id : '123456789012';
		let query = productoModel.findOne({
			$and: [
				{_id: secureIdProducto},
				{status: true}
			]
		});

		query.exec((err, producto) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerProductoPorId: ', err);
				return callback({success: false, message: 'Error al consultar producto'});
			}

			return callback({success: true, producto: producto});
		});
	},

	findByIdAndUpdate: function (producto, callback) {

        productoModel.findByIdAndUpdate(producto._id, producto, function (err, _producto) {

            if (err) {
            	log.error(fileJS, 'Error findByIdAndUpdate: ', err);
                return callback({success: false, message: 'Error al actualizar producto', err: err});
            }                         
            
            return callback({success: true, message: 'Producto actualizado exitosamente', producto: _producto});
        });
    },

    /**
     * Funcion que actualiza el numero de visitas de un producto
     * @param  {String}   id     Id del producto a actualizar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    actualizarVisitaProducto: function(id, callback) {

    	productoModel.findByIdAndUpdate(id, {$inc: { visitas: 1 }}, function (err, producto) {

            if (err) {
            	log.error(fileJS, 'Error actualizarVisitaProducto: ', err);
                return callback({success: false, message: 'Error al actualizar el numero de visitas producto', err: err});
            }                         
            
            return callback({success: true, message: 'El numero de visitas fue actualizado', producto: producto});
        });
    },

    /**
	 * Funcion que obtiene la lista de productos por busqueda reciente
	 * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {Array}     listaProducto 	Lista de id de productos
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	obtenerListaProductosPorId: function(listaProductos, callback) {

		var arrayId = [];
		
		// Se itera la lista
		for(var i = 0; i < listaProductos.length; i++) {
			var secureObjectIdProducto = (mongoose.Types.ObjectId(listaProductos[i])) ? listaProductos[i] : '123456789012';
			arrayId.push(secureObjectIdProducto);
		}

		let query = productoModel.find({_id: {$in: arrayId}});

		query.exec((err, productos) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductosPorId: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

    /**
     * Funcion que actualiza el numero de productos en el stock
     * @param  {Object}   producto    objeto de producto
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    actualizarPiezasDisponiblesProducto: function(producto, callback) {

    	const secureObjectId = (mongoose.Types.ObjectId.isValid(producto._id)) ? (mongoose.Types.ObjectId(producto._id)) : '123456789012';
    	productoModel.findByIdAndUpdate(secureObjectId, {$inc: { piezasDisponibles: producto.piezasDisponibles}}, function (err) {

            if (err) {
            	log.error(fileJS, 'Error actualizarPiezasDisponiblesProducto: ', err);
                return callback({success: false, message: 'Error al actualizar el numero de piezas disponibles del producto', err: err});
            }                         
            
            return callback({success: true, message: 'El numero de piezas disponibles fue actualizado'});
        });
    },

    /**
     * Query que obtiene una lista de producto que han expirado
     * @param  {Function} callback Encapsula el resultado de la consulta     
     */
    obtenerListaProductosExpirados: function (callback){
    	let query = productoModel.find({ $and: [{status: true}, {fechaExpiracion: {$lte: new Date()} }] });
		query.exec((err, productos) => {
			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error obtenerListaProductosExpirados: ', err);
				return callback({success: false, err: err});
			}

			return callback({success: true, productos: productos});
		});
	},

	/**
	 * Query que actualiza el status de un producto
	 * @param  {Producto}   producto objeto
	 * @param  {Function} callback Encapsula el resultado de la operacion	 
	 */
    cambiarEstatusProducto: function(producto, callback) {
    	const secureObjectId = (mongoose.Types.ObjectId.isValid(producto._id)) ? (mongoose.Types.ObjectId(producto._id)) : '123456789012';
    	productoModel.findByIdAndUpdate(secureObjectId, {status: producto.status}, function (err) {
            if (err) {
            	log.error(fileJS, 'Error cambiarEstatusProducto: ', err);
                return callback({success: false, message: 'Error al cambiar el estatus del producto', err: err});
            }                                    
            return callback({success: true, message: 'El estatus del producto fue actualizado correctamente'});
        });
    },

    desactivarListaProductos: function(listaProductos, callback) {
		
		// Se itera la lista
		for(var i = 0; i < listaProductos.length; i++) {
			listaProductos[i]._id = (mongoose.Types.ObjectId(listaProductos[i]._id)) ? listaProductos[i]._id : '123456789012';
		}

		let query = productoModel.update({$or: listaProductos}, {$set: {status: false}}, { multi: true });

		query.exec((err) => {

			// Se verifica si ocurrio un error
			if (err) {
				log.error(fileJS, 'Error desactivarListaProductos: ', err);
				return callback({success: false, err: err, message: 'Error al dar de baja los productos'});
			}

			return callback({success: true, message: 'Los productos fueron dados de baja'});
		});
	},
};