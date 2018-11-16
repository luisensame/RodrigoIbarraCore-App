'use strict';

const express = require('express');
const multipart = require('connect-multiparty');
const async = require('async');


//services
const productoService = require('../../services/producto.service');
const cloudinaryService = require('../../services/cloudinary.service');

const productoRouter = express.Router();

/* ----------------- GET LISTA PRODUCTOS ----------------- */
productoRouter.get('/:noElementos/:offSet', (req, res) => {

	// Se verifica si los parametros existen
	if(typeof req.params.offSet !== 'undefined' && typeof req.params.noElementos !== 'undefined') {

		let offSet = parseInt(req.params.offSet); // Numero del indice de donde se obtendran los productos
		let noElementos = parseInt(req.params.noElementos); // Numero de productos a obtener

		// Se invoca al service
		productoService.obtenerListaProductos(offSet, noElementos, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener la lista de productos'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene la lista de productos', productos: result.productos});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET LISTA PRODUCTOS POR DESTACADOS ----------------- */
productoRouter.get('/destacados/:noElementos/:offSet', (req, res) => {

	// Se verifica si los parametros existen
	if(typeof req.params.offSet !== 'undefined' && typeof req.params.noElementos !== 'undefined') {

		let offSet = parseInt(req.params.offSet); // Numero del indice de donde se obtendran los productos
		let noElementos = parseInt(req.params.noElementos); // Numero de productos a obtener

		// Se invoca al service
		productoService.obtenerListaProductosDestacados(offSet, noElementos, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener la lista de productos'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene la lista de productos', productos: result.productos});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET LISTA PRODUCTOS EN OFERTA ----------------- */
productoRouter.get('/oferta/:noElementos/:offSet', (req, res) => {

	// Se verifica si los parametros existen
	if(typeof req.params.offSet !== 'undefined' && typeof req.params.noElementos !== 'undefined') {

		let offSet = parseInt(req.params.offSet); // Numero del indice de donde se obtendran los productos
		let noElementos = parseInt(req.params.noElementos); // Numero de productos a obtener

		// Se invoca al service
		productoService.obtenerListaProductosOferta(offSet, noElementos, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener la lista de productos'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene la lista de productos', productos: result.productos});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET LISTA PRODUCTOS BUSQUEDA RECIENTE ----------------- */
productoRouter.post('/busqueda/:noElementos/:offSet', (req, res) => {

	// Se verifica si los parametros existen
	if(
		typeof req.params.offSet !== 'undefined' &&
		typeof req.body.listaProducto !== 'undefined' &&
		typeof req.params.noElementos !== 'undefined') {

		let offSet = parseInt(req.params.offSet); // Numero del indice de donde se obtendran los productos
		let listaProducto = req.body.listaProducto; // Lista de id a buscar
		let noElementos = parseInt(req.params.noElementos); // Numero de productos a obtener

		// Se invoca al service
		productoService.obtenerListaProductosBusqueda(offSet, noElementos, listaProducto, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener la lista de productos'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene la lista de productos', productos: result.productos});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET LISTA PRODUCTOS BUSQUEDA RECIENTE ----------------- */
productoRouter.get('/categoria/:noElementos/:offSet/:idCategoria', (req, res) => {

	// Se verifica si los parametros existen
	if(
		typeof req.params.offSet !== 'undefined' &&
		typeof req.params.idCategoria !== 'undefined' &&
		typeof req.params.noElementos !== 'undefined') {

		let offSet = parseInt(req.params.offSet); // Numero del indice de donde se obtendran los productos
		let idCategoria = req.params.idCategoria; // Lista de id a buscar
		let noElementos = parseInt(req.params.noElementos); // Numero de productos a obtener

		// Se invoca al service
		productoService.obtenerListaProductosCategoria(offSet, noElementos, idCategoria, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener la lista de productos'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene la lista de productos', productos: result.productos});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET TOTAL PRODUCTOS ----------------- */
productoRouter.get('/total', (req, res) => {

	// Se invoca al service
	productoService.obtenerTotalProductos((result) => {

		// Se verifica si ocurrio un error
		if(result.err) {
			res.status(500).json({success: false, message: 'Error interno al obtener el total de productos registrados'});
		}else{
			res.status(200).json({success: true, message: 'Se obtiene el total de registros', totalRegistros: result.totalRegistros});
		}
	});
});

/* ----------------- GET TOTAL PRODUCTOS EN OFERTA ----------------- */
productoRouter.get('/total-oferta', (req, res) => {

	// Se invoca al service
	productoService.obtenerTotalProductosOferta((result) => {

		// Se verifica si ocurrio un error
		if(result.err) {
			res.status(500).json({success: false, message: 'Error interno al obtener el total de productos registrados'});
		}else{
			res.status(200).json({success: true, message: 'Se obtiene el total de registros', totalRegistros: result.totalRegistros});
		}
	});
});

/* ----------------- GET TOTAL PRODUCTOS POR CATEGORIA ----------------- */
productoRouter.get('/total/buscar/categoria/:idCategoria', (req, res) => {

	// Se verifica si existe el parametros
	if(typeof req.params.idCategoria !== 'undefined') {

		// Se recupera el parametros
		let idCategoria = req.params.idCategoria;

		// Se invoca al service
		productoService.obtenerTotalProductosCategoria(idCategoria, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener el total de productos registrados'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene el total de registros', totalRegistros: result.totalRegistros});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- POST CREACION DE PRODUCTO ----------------- */
productoRouter.post('/', multipart(), (req, res) => {	
	//new product
	let producto = JSON.parse(req.body.producto) || {};		
		producto.imagenes = [];
	//image of product
	let images =  req.files.files;	

	//upload images to cloudinary
	async.each(images, function(image, callback){		
		cloudinaryService.upload(image, function (result){
			if (!result.public_id) {
				callback('Error image upload to cloudinary');
			}else{
				//add image upload to product
				producto.imagenes.push(result.url);
				callback();
			}
		});
	}, function (err){
		//if err notifify user
		if (err) {
			return res.status(500).json({success: false, message: 'Error al subir imagenes'});
		}

		//Proceso para almacenar el producto en bd
		productoService.registrar(producto, function (result){
			if (!result.success) {
				return res.status(500).json({success: false, message: 'Error al registrar nuevo producto'});
			}

			return res.status(200).json({success: true, message: 'Producto registrado exitosamente'});
		});	
	});		
});

/* ----------------- GET TOTAL BUSQUEDA ----------------- */
productoRouter.get('/total-busqueda', (req, res) => {

	// Se verifica si existe el parametros
	if(typeof req.query.palabra !== 'undefined') {

		// Se recupera el parametros
		let palabra = req.query.palabra;

		// Se invoca al service
		productoService.obtenerTotalProductosBusqueda(palabra, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener el total de productos registrados'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene el total de registros', totalRegistros: result.totalRegistros});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET LIST BUSQUEDA ----------------- */
productoRouter.get('/busqueda', (req, res) => {

	if(
		typeof req.query.offSet !== 'undefined' &&
		typeof req.query.palabra !== 'undefined'&&
		typeof req.query.noElementos !== 'undefined'
	) {

		// Se recupera el parametros
		let palabra = req.query.palabra; // palabra a buscar
		let offSet = parseInt(req.params.offSet); // Numero del indice de donde se obtendran los productos
		let noElementos = parseInt(req.params.noElementos); // Numero de productos a obtener

		// Se invoca al service
		productoService.obtenerProductosBusqueda(offSet, noElementos, palabra, (result) => {

			// Se verifica si ocurrio un error
			if(result.err) {
				res.status(500).json({success: false, message: 'Error interno al obtener la lista de productos'});
			}else{
				res.status(200).json({success: true, message: 'Se obtiene la lista de productos en busqueda', productos: result.productos});
			}
		});
	} else {

		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET ALL LISTA PRODUCTOS ----------------- */
productoRouter.get('/', (req, res) => {		
	// Se invoca al service
	productoService.getAllProductos((result) => {
		// Se verifica si ocurrio un error		
		if(result.err) {
			res.status(500).json({success: false, message: 'Error interno al obtener todos los productos'});
		}else{
			res.status(200).json({success: true, message: 'Se obtiene la lista de productos', productos: result.productos});
		}
	});	
});

/* ----------------- GET PRODUCTO por ID ----------------- */
productoRouter.get('/:id', (req, res) => {	
	//Se obtiene el id del producto
	let idProducto = req.params.id;
	//Se invoca al servicio para buscar el producto
	productoService.obtenerProductoPorId(idProducto, (result) => {
		if (result.err || !result.success) {
			return res.status(500).json({success: false, message: 'Error al consultar producto por id'});
		}	
		return res.status(200).json({success: true, message: 'Operacion exitosa', producto: result.producto});
	});		
});

/* ----------------- PUT UPDATE DE PRODUCTO ----------------- */
productoRouter.put('/', multipart(), (req, res) => {	
	//get product
	let producto = JSON.parse(req.body.producto) || {};
	
	//image of product
	let images =  req.files.files;	

	//imagenes a actualizar
	let updateImage = producto.updateImage;	

	async.waterfall([
		//update product in db
		function (callback){
			productoService.findByIdAndUpdate(producto, function (result){
				//if update success
				if (result.success) {
					return callback(null, result.producto);
				}

				//if err
				return callback(true, result.message);
			});
		},
		function (_producto, callback){		
			//if new images
			if (images) {

				//clean images of result array of producto
				producto.imagenes = [];

				async.series([
				    function(callbackCDN) {
				    	//Si la imagen 0 esta para editar
						if (updateImage[0]) {
							
							//Si existe imagen en la posicion 0 se sube la nueva imagen
							cloudinaryService.upload(images[0], function (result){
								if (!result.public_id) {
									console.log('error al subir new imagen para posicion 0');
									callbackCDN(true, 'error al subir imagen cero');
								}else{
									//Se actualiza path de imagen nueva en producto
									producto.imagenes.push(result.url);								

									//Se analiza si existe imagen de producto en la posicion 0
									if (_producto.imagenes[0]) {
										//Si existe imagen se elimina
										var img = _producto.imagenes[0];
										var arrayPath = img.split('/');
										var arrayDot = arrayPath[arrayPath.length - 1].split('.');
										//pass the plublicid to delete image
										cloudinaryService.delete(arrayDot[0], function (resultDelete){
											if (!resultDelete.result && resultDelete.result !== 'ok') {
												console.log('Error al eliminar imagen 0');
											}
										});
									}									
									callbackCDN(false, 'imagen cero subida a CDN');
								}
							});
						}else{
							//Si la imagen 0 no se edita se verifica que el producto tienen imagen en 0
							if (_producto.imagenes[0]) {							
								//conserva la misma url de la imagen 0
								producto.imagenes.push(_producto.imagenes[0]);
							}
							callbackCDN(false, 'imagen cero no editada');
						}
					},
				    function(callbackCDN) {
				    	//Si la imagen 0 esta para editar
						if (updateImage[1]) {
							
							//Si existe imagen en la posicion 0 se sube la nueva imagen
							cloudinaryService.upload(images[1], function (result){
								if (!result.public_id) {
									console.log('error al subir new imagen para posicion 1');
									callbackCDN(true, 'error al subir imagen uno');
								}else{
									//Se actualiza path de imagen nueva en producto
									producto.imagenes.push(result.url);								

									//Se analiza si existe imagen de producto en la posicion 0
									if (_producto.imagenes[1]) {
										//Si existe imagen se elimina
										var img = _producto.imagenes[1];
										var arrayPath = img.split('/');
										var arrayDot = arrayPath[arrayPath.length - 1].split('.');
										//pass the plublicid to delete image
										cloudinaryService.delete(arrayDot[0], function (resultDelete){
											if (!resultDelete.result && resultDelete.result !== 'ok') {
												console.log('Error al eliminar imagen 1');
											}
										});
									}									
									callbackCDN(false, 'imagen uno subida a CDN');
								}
							});
						}else{
							//Si la imagen 0 no se edita se verifica que el producto tienen imagen en 0
							if (_producto.imagenes[1]) {							
								//conserva la misma url de la imagen 0
								producto.imagenes.push(_producto.imagenes[1]);
							}
							callbackCDN(false, 'imagen uno no editada');
						}
					},
					function(callbackCDN) {
				    	//Si la imagen 0 esta para editar
						if (updateImage[2]) {
							
							//Si existe imagen en la posicion 0 se sube la nueva imagen
							cloudinaryService.upload(images[2], function (result){
								if (!result.public_id) {
									console.log('error al subir new imagen para posicion 2');
									callbackCDN(true, 'error al subir imagen dos');
								}else{
									//Se actualiza path de imagen nueva en producto
									producto.imagenes.push(result.url);								

									//Se analiza si existe imagen de producto en la posicion 2
									if (_producto.imagenes[2]) {
										//Si existe imagen se elimina
										var img = _producto.imagenes[2];
										var arrayPath = img.split('/');
										var arrayDot = arrayPath[arrayPath.length - 1].split('.');
										//pass the plublicid to delete image
										cloudinaryService.delete(arrayDot[0], function (resultDelete){
											if (!resultDelete.result && resultDelete.result !== 'ok') {
												console.log('Error al eliminar imagen 2');
											}
										});
									}									
									callbackCDN(false, 'imagen dos subida a CDN');
								}
							});
						}else{
							//Si la imagen 0 no se edita se verifica que el producto tienen imagen en 0
							if (_producto.imagenes[2]) {
								//conserva la misma url de la imagen 2
								producto.imagenes.push(_producto.imagenes[2]);
							}
							callbackCDN(false, 'imagen dos no editada');
						}
					},
					function(callbackCDN) {
				    	//Si la imagen 0 esta para editar
						if (updateImage[3]) {
							
							//Si existe imagen en la posicion 3 se sube la nueva imagen
							cloudinaryService.upload(images[3], function (result){
								if (!result.public_id) {
									console.log('error al subir new imagen para posicion 3');
									callbackCDN(true, 'error al subir imagen tres');
								}else{
									//Se actualiza path de imagen nueva en producto
									producto.imagenes.push(result.url);								

									//Se analiza si existe imagen de producto en la posicion 0
									if (_producto.imagenes[3]) {
										//Si existe imagen se elimina
										var img = _producto.imagenes[3];
										var arrayPath = img.split('/');
										var arrayDot = arrayPath[arrayPath.length - 1].split('.');
										//pass the plublicid to delete image
										cloudinaryService.delete(arrayDot[0], function (resultDelete){
											if (!resultDelete.result && resultDelete.result !== 'ok') {
												console.log('Error al eliminar imagen 3');
											}
										});
									}									
									callbackCDN(false, 'imagen tres subida a CDN');
								}
							});
						}else{
							//Si la imagen 0 no se edita se verifica que el producto tienen imagen en 0
							if (_producto.imagenes[3]) {							
								//conserva la misma url de la imagen 0
								producto.imagenes.push(_producto.imagenes[3]);
							}
							callbackCDN(false, 'imagen uno no editada');
						}
					},
				], function (err, result) {
				    // result now equals 'done'
				    if (err) {
				    	return callback(true, 'El producto se actualizo, pero surgio un error al actualizar imagenes en CDN');
				    }

				    //Se actualizan las imagenes del producto
					productoService.findByIdAndUpdate(producto, function (resultUpdate){
						if (!resultUpdate.success) {
							callback(true, 'Error al actualizar CDN del producto');
						}

						callback(null, 'Producto actualizado exitosamente');
					});			
				});				


				//delete images from cloudinary
				/*async.each(_producto['imagenes'], function (img, callback){
					var arrayPath = img.split('/');					
					var arrayDot = arrayPath[arrayPath.length - 1].split('.');
					//pass the plublicid to delete image
					cloudinaryService.delete(arrayDot[0], function (result){
						if (!result.result && result.result !== 'ok') {
							console.log('Error al eliminar imagenes');
						}
					});					
				});*/

				//upload new images				
				/*async.each(images, function(image, callbackEach){
					cloudinaryService.upload(image, function (result){
						if (!result.public_id) {
							callbackEach(true);
						}else{
							//add image upload to product
							producto.imagenes.push(result.url);
							callbackEach();
						}
					});
				}, function (err){
					//if err notifify user
					if (err) {
						return _callback(true, 'El producto se actualizo, pero surgio un error al actualizar imagenes en CDN');
					}

					//Se actualizan las imagenes del producto
					productoService.findByIdAndUpdate(producto, function (result){
						if (!result.success) {
							_callback(true, 'Error al actualizar producto');
						}

						_callback(null, 'Producto actualizado exitosamente');
					});			


				});		*/
			}else{				
				callback(null, 'Producto actualizado exitosamente');
			}
		}
	], function (err, results){
		if (err) {			
			return res.status(500).json({success: false, message: results});
		}		
		return res.status(200).json({success: true, message: results});
	});
});

/* ----------------- PUT UPDATE VISITA PRODUCTO  ----------------- */
productoRouter.put('/visita/:id', (req, res) => {
	
	// Se verifica si existe el id
	if(req.params.id) {

		let id = req.params.id; // Se obtiene la informacion del usuario

		// Se invoca al servicio
		productoService.actualizarVisitaProducto(id, (result) => {

			// Se verifica si ocurrio un error
			if (result.err || !result.success) {
				return res.status(500).json({success: false, message: 'Error al actualizar el numero de vistas del producto'});
			}

			return res.status(200).json({success: true, message: 'Operacion exitosa', producto: result.producto});
		});
	} else {
		return res.status(500).json({success: false, message: 'Ocurrio un error al obtener los parametros'});
	}
});

module.exports = productoRouter;