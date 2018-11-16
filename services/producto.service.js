'use strict';

// Daos
const productoDao = require('../dao/producto.dao');

function quitaArticulos(palabra) {
	return palabra.replace('DEL ', ' ')
	.replace('LAS ', ' ')
	.replace('DE ', ' ')
	.replace('LA ', ' ')
	.replace('Y ', ' ')
	.replace('A ', ' ');
}

module.exports = {

	/**
     * Funcion que obtiene la lista de productos
     * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {Integer}   ordenamiento 	Ordenamiento de la lista
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerListaProductos: function(offSet, noElementos, callback) {
		
		// Se invoca al dato
		productoDao.obtenerListaProductos(offSet, noElementos, (result) => {
			callback(result);
		});
	},

	/**
     * Funcion que obtiene la lista de productos destacados
     * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerListaProductosDestacados: function(offSet, noElementos, callback) {
		
		// Se invoca al dato
		productoDao.obtenerListaProductosDestacados(offSet, noElementos, (result) => {
			callback(result);
		});
	},

	/**
     * Funcion que obtiene la lista de productos en oferta
     * @param  {Integer}   offset    	Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 	Numero de productos a obtener
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerListaProductosOferta: function(offSet, noElementos, callback) {
		
		// Se invoca al dato
		productoDao.obtenerListaProductosOferta(offSet, noElementos, (result) => {
			callback(result);
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
		
		// Se invoca al dato
		productoDao.obtenerListaProductosBusqueda(offSet, noElementos, listaProducto, (result) => {
			callback(result);
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
		
		// Se invoca al dato
		productoDao.obtenerListaProductosCategoria(offSet, noElementos, idCategoria, (result) => {
			callback(result);
		});
	},

	/**
     * Funcion que obtiene el total de productos
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerTotalProductos: function(callback) {

		// Se invoca al dato
		productoDao.obtenerTotalProductos((result) => {
			callback(result);
		});
	},

	/**
     * Funcion que obtiene el total de productos en oferta
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerTotalProductosOferta: function(callback) {

		// Se invoca al dato
		productoDao.obtenerTotalProductosOferta((result) => {
			callback(result);
		});
	},

	/**
     * Funcion que obtiene el total de productos por categoria
     * @param  {Integer} idCategoria  categoria a buscar
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
	obtenerTotalProductosCategoria: function(idCategoria, callback) {

		// Se invoca al dato
		productoDao.obtenerTotalProductosCategoria(idCategoria, (result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que registra un nuevo producto
	 * @param  {Producto}   producto objecto
	 * @param  {Function} callback envia el resultado de la operacion	 
	 */
	registrar: function (producto, callback) {
		productoDao.registrar(producto, (result) => {
			callback(result);
		});
	},

	getAllProductos: function (callback) {
		productoDao.getAllProductos((result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que obtiene el total de productos mediante una busqueda
	 * @param  {String}   palabra por la que se va a buscar
	 * @param  {Function} callback envia el resultado de la operacion	 
	 */
	obtenerTotalProductosBusqueda: function (palabra, callback) {

		// Se invoca a la funcion para quitar articulos
		palabra = quitaArticulos(palabra.toUpperCase());
		
		// Se invoca al dato
		productoDao.obtenerTotalProductosBusqueda(palabra, (result) => {
			callback(result);
		});
	},

	/**
	 * Funcion que obtiene el los productos mediante una busqueda
	 * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {String}   palabra por la que se va a buscar
	 * @param  {Function} callback envia el resultado de la operacion	 
	 */
	obtenerProductosBusqueda: function (offSet, noElementos, palabra, callback) {

		// Se invoca a la funcion para quitar articulos
		palabra = quitaArticulos(palabra.toUpperCase());
		
		// Se invoca al dato
		productoDao.obtenerProductosBusqueda(offSet, noElementos, palabra, (result) => {
			callback(result);
		});
	},

	obtenerProductoPorId: function (id, callback) {
		productoDao.obtenerProductoPorId(id, (result) => {
			callback(result);
		});
	},

	findByIdAndUpdate: function (producto, callback) {
		productoDao.findByIdAndUpdate(producto, (result) => {
			callback(result);
		});
	},

	/**
     * Funcion que actualiza el numero de visitas de un producto
     * @param  {String}   id     Id del producto a actualizar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    actualizarVisitaProducto: function(id, callback) {
    	
        // Se invoca al metodo que actualiza la informacion
        productoDao.actualizarVisitaProducto(id, (result) => {
            callback(result);
        });
    },

    obtenerListaProductosPorId: function(listaProductos, callback) {

    	// Se invoca al metodo que actualiza la informacion
        productoDao.obtenerListaProductosPorId(listaProductos, (result) => {
            callback(result);
        });
    },

    /**
     * Funcion que actualiza el numero de productos en el stock
     * @param  {Object}   producto    objeto de producto
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    actualizarPiezasDisponiblesProducto: function(producto, callback) {
    	
        // Se invoca al metodo que actualiza la informacion
        productoDao.actualizarPiezasDisponiblesProducto(producto, (result) => {
            callback(result);
        });
    },


    /**
     * Servicio que obtiene una lista de productos expirados
     * @param  {Function} callback Encapsula el resultado de la operacion     
     */
    obtenerListaProductosExpirados: function(callback) {
    	productoDao.obtenerListaProductosExpirados((result) => {
    		callback(result);
    	});
    },

    /**
     * Funcion que desactiva un producto
     * @param  {Producto}   producto objeto
     * @param  {Function} callback encapsula el resultado de la operacion     
     */
    desactivarProducto: function(producto, callback) {
    	// Se invoca al metodo que actualiza la informacion
        productoDao.cambiarEstatusProducto(producto, (result) => {
            callback(result);
        });
    },

    /**
     * Funcion que desactiva un producto
     * @param  {Producto}   producto objeto
     * @param  {Function} callback encapsula el resultado de la operacion     
     */
    desactivarListaProductos: function(listaProductos, callback) {
    	// Se invoca al metodo que actualiza la informacion
        productoDao.desactivarListaProductos(listaProductos, (result) => {
            callback(result);
        });
    }
};