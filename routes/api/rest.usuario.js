'use strict';

const express = require('express');

const config = require('../../config.js');

//logs
const log4js = require('log4js'),
	log = log4js.getLogger('kitchen'),
	fileJS = 'rest.usuario > ';

//services
const pedidoService = require('../../services/pedido.service');
const usuarioService = require('../../services/usuario.service');
const conektaService = require('../../services/conekta.service');
const reseniaService = require('../../services/resenia.service');
const favoritoService = require('../../services/favorito.service');
const cloudinaryService = require('../../services/cloudinary.service');

// Util
const async = require('async');
const multipart = require('connect-multiparty');

const usuarioRouter = express.Router();

/* ------------------------ GET information user ------------------------ */
usuarioRouter.get('/me', (req, res) => {

	let decoded = req.decoded;

	// Se verifica si existe el parametro email
	if(decoded && decoded.email) {

		// Invoque service user
		usuarioService.buscarPorEmail(decoded.email, (result) => {

			// If request is correct
			if (result.success) {

				// Se crea la respuesta
				let resultJson = {success: true, message: 'success found usuario'};

				// Se verifica si se obtiene la informacion del usuario
				if(result.usuario) {

					// Object user
					resultJson.usuario = {
						_id: result.usuario._id,
						email: result.usuario.email,
						imagen: result.usuario.imagen,
						customer: result.usuario.customer,
						idOrigen: result.usuario.idOrigen,
						apellidos: result.usuario.apellidos,
						fechaRegistro: result.usuario.fechaRegistro,
						nombreCompleto: result.usuario.nombreCompleto,
						direccionEnvio: result.usuario.direccionEnvio,
					};
				}

				//when success
				return res.status(200).json(resultJson);
			}

			//when error
			log.error(fileJS, 'Error /me buscarPorEmail: ', result);
			return res.status(500).json({
				success: false,
				message: 'Error to get usuario'			
			});
		});
	} else {
		//when error		
		return res.status(500).json({
			success: false,
			message: 'Error to get usuario'			
		});
	}
});

/* ------------------------ PUT UPDATE INFORMATION USER ------------------------ */
usuarioRouter.post('/', multipart(), function (req, res) {

	// Se verifica si existe el parametro
	if(req.body.usuario) {

		let urlImage = req.body.urlImage;
		let usuario = JSON.parse(req.body.usuario); // Se obtiene los datos del usuario
		let image = (req.files && req.files.file) ? req.files.file : undefined;

		async.parallel([

			function(callback) {

				setTimeout(function () {

					// Se verifica si existe una imagen
					if(image) {

						// Se verifica si hay una imagen que borrar
						if(urlImage) {

							let arrayPath = urlImage.split('/');
							let imageId = arrayPath[arrayPath.length - 1].split('.')[0];

							// Se elimina la imagen
							cloudinaryService.delete('profile/' + imageId, function(result) {

								if (!result.result && result.result !== 'ok') {
									console.log('Error al eliminar imagenes');
									log.error(fileJS, 'Error al eliminar imagenes: ', result);
								}
							});
						}

						// Se invoca al servicio
						cloudinaryService.uploadFolder(image, {folder: 'profile/'}, function(result) {

							// Se verifica si ocurrio un error
							if (!result.public_id) {
								log.error(fileJS, 'Error image upload to cloudinary: ', result);
								callback('Error image upload to cloudinary');
							} else { // En caso de no ocurrir un error
								callback(null, result.url);
							}
						});
					} else {
						callback();
					}

				}, 200);
			},
		], function (err, result) {

			if(err) {
				log.error(fileJS, 'Error update usuario: ', err);
				return res.status(500).json({
					success: false,
					message: 'Error al actualizar la informacion del usuario'			
				});
			}

			// Se verifica si se obtiene la url de la imagen
			if(result && Array.isArray(result)) usuario.imagen = result[0];

			// Invoca al servicio que actualiza la informacion local de un usuario
			usuarioService.actualizarInformacion(usuario, (result) => {

				// Se verifica si no ocurrio un error
				if(result.success && !result.err) {
					//when error
					return res.status(200).json({
						success: true,
						url: usuario.imagen,
						message: 'Se actualizan los datos del usuario'
					});
				} else {
					//when error
					log.error(fileJS, 'Error update usuario: ', result);
					return res.status(500).json({
						success: false,
						message: 'Error al actualizar la informacion del usuario'			
					});
				}
			});
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error parametros incorrectos'			
		});
	}
});

/* ------------------------ PUT UPDATE INFORMATION USER ------------------------ */
usuarioRouter.put('/', function (req, res) {

	// Se verifica si existe el parametro
	if(req.body.usuario) {

		// Se obtiene la informacion del usuario
		let usuario = req.body.usuario;
		
		// Invoca al servicio que actualiza la informacion local de un usuario
		usuarioService.actualizarInformacion(usuario, (result) => {

			// Se verifica si no ocurrio un error
			if(result.success && !result.err) {

				//when error
				return res.status(200).json({
					success: true,
					message: 'Se actualizan los datos del usuario'
				});
			} else {
				//when error
				log.error(fileJS, 'Error update usuario: ', result);
				return res.status(500).json({
					success: false,
					message: 'Error al actualizar la informacion del usuario'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error parametros incorrectos'			
		});
	}
});

/* ------------------------ PUT UPDATE INFORMATION USER ------------------------ */
usuarioRouter.put('/eliminar-cuenta/:email', function (req, res) {

	// Se verifica si existe el parametro
	if(req.params.email) {

		// Se obtiene la informacion del usuario
		let email = req.params.email;

		async.waterfall([

			// Se eliminan los pedidos que se encuentre asociados al usuario
			(callback) => {

				// Se verifica si existe el usuario
				usuarioService.buscarPorEmail(email, (result) => {

					// Se verifica si no ocurrio un error
					if(!result.err) {
						callback(null, null, result.usuario);
					} else {
						log.error(fileJS, 'Error eliminar-cuenta: ', result);
						callback(null, result.err, null);
					}
				});
			},

			// Funcion que desactiva un pedido
			(err, usuario, callback) => {
				
				// Si no ocurrio un error
				if(!err) {

					// Se verifica si el usuario existe
					if(usuario._id) {

						// Se invoca al servicio que desactiva el pedido
						pedidoService.desactivarPedido(usuario._id, (result) => {

							// Se verifica si ocurrio un error
							if(!err) {
								callback(null, null, usuario);
							} else {
								callback(null, result.err, null);
							}
						});
					} else {
						callback(null, null, {});
					}
				} else {
					log.error(fileJS, 'Error desactiva pedidos: ', err);
					callback(null, err, null);
				}
			},

			// Funcion que desactiva los productos como favoritos
			(err, usuario, callback) => {

				// Si no ocurrio un error
				if(!err) {

					// Se verifica si el usuario existe
					if(usuario._id) {

						// Se elimina un producto como favorito
						favoritoService.eliminarFavorito(usuario.email, (result) => {

							// Se verifica si no ocurrio un error
							if(!result.err) {
								callback(null, null, usuario);
							} else {
								callback(null, result.err, null);
							}
						});
					} else {
						callback(null, null, {});
					}
				} else {
					log.error(fileJS, 'Error desactiva productos: ', err);
					callback(null, err, null);
				}
			},

			// Funcion que desactiva las resenias
			(err, usuario, callback) => {

				// Si no ocurrio un error
				if(!err) {

					// Se verifica si el usuario existe
					if(usuario._id) {

						// Se elimina un producto como favorito
						reseniaService.cambiarEstatusResenia(usuario._id, (result) => {

							// Se verifica si no ocurrio un error
							if(!result.err) {
								callback(null, {success: true});
							} else {
								callback(result.err, null);
							}
						});
					} else {
						callback(null, {});
					}
				} else {
					log.error(fileJS, 'Error desactiva resenias: ', err);
					callback(err, null);
				}
			}
		], (err, result) => {

			if(err) {
				log.error(fileJS, 'Error elimina cuenta: ', err);
				return res.status(500).json({
					success: false,
					message: 'Error al eliminar la cuenta'
				});
			}

			if(!result.success) {
				return res.status(200).json({
					usuario: {},
					success: false,
					message: 'El usuario no se encuentra'
				});
			}

			const usuario = {
				email: email,
				customer: {},
				imagen: null,
				estatusUsuario: 2,
				direccionEnvio: {},
			};

			// Invoca al servicio que actualiza la informacion local de un usuario
			usuarioService.eliminarCuentaUsuario(usuario, (result) => {

				// Se verifica si no ocurrio un error
				if(result.success && !result.err) {

					//when error
					log.info(fileJS, 'Eliminacion de cuenta exitosa');
					return res.status(200).json({
						success: true,
						message: 'Se ha eliminado la cuenta'
					});
				} else {
					//when error
					log.error(fileJS, 'Error eliminacion de cuenta: ', result);
					return res.status(500).json({
						success: false,
						message: 'Error al eliminar la cuenta'
					});
				}
			});
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error parametros incorrectos'			
		});
	}
});

/* ------------------------ GET information card user ------------------------ */
usuarioRouter.get('/tarjeta/:customerId', (req, res) => {

	// Se verifica si existe el parametro
	if(req.params.customerId) {

		// Se obtiene la informacion del usuario
		let customerId = req.params.customerId;
		
		// Invoca al servicio que actualiza la informacion local de un usuario
		conektaService.buscarCustomer(customerId, (result) => {

			// Se verifica si no ocurrio un error
			if(result.success && !result.err) {

				//when error
				return res.status(200).json({
					success: true,
					tarjeta: result.tarjeta,
					message: 'Se obtiene la informacion de la tarjeta'
				});
			} else {
				//when error
				log.error(fileJS, 'Error buscarCustomer: ', result);
				return res.status(500).json({
					success: false,
					message: 'Error al obtener la informacion de la tarjeta'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error parametros incorrectos'			
		});
	}
});

module.exports = usuarioRouter;