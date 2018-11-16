'use strict';

// Daos
const productoDao = require('../dao/producto.dao');

module.exports = {

	/**
	 * Funcion que obtiene la lista de productos por categoria
	 * @param  {Integer}   offset    		Numero del indice de donde se obtendran los productos
	 * @param  {Integer}   noElementos 		Numero de productos a obtener
	 * @param  {Array}     idCategoria 		id de la categoria
	 * @param  {Function} callback encapsula la informacion de retorno async 
	 */
	/*obtenerListaProductosCategoria: function(offSet, noElementos, idCategoria, callback) {
		
		// Se invoca al dato
		productoDao.obtenerListaProductosCategoria(offSet, noElementos, idCategoria, (result) => {
			console.log(result)
			callback(result);
		});
	},*/

	/*obtenerProductoPorId: function (id, callback) {
		productoDao.obtenerProductoPorId(id, (result) => {
			consult.log(result)
			callback(result);
		});
	},*/
	obtenerListaProductosCategoria: function (req,res) {
		var idCategoria = req.params.id
		var offset = req.body.offset
		var noElementos = req.noElementos
		// Se invoca al dato
		productoDao.obtenerListaProductosCategoria(offset, noElementos, idCategoria, (result) => {
			console.log(result)
			if (result.productos != null) {
				res.status(201)
				res.json({
					status: "success",
					productos: result.productos
				})
			}else{
				res.status(400)
				res.json({
					status: "failure",
					message: "no existe la categoría"
				})
			}
		});
	},

	obtenerProductoPorId:  function (req, res) {
		var id = req.params.id
		productoDao.obtenerProductoPorId(id, (result) => {
			console.log(result)
			//callback(result);
			if (result.producto != null) {
				res.status(201)
				res.json({
					status: "success",
					producto: result.producto 
				})
			}else{
				res.status(400)
				res.json({
					status: "failure",
					message: "no se encuentro el producto"
				})
			}
		})
	}
}