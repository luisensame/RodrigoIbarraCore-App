"use strict";

const express = require('express');

//jwt for authenticate restful request
const jwt = require('jsonwebtoken');

//config file
const config = require('../config');

//logs
const log4js = require('log4js'),
	log = log4js.getLogger('sell-it-app'),
	fileJS = 'api > ';

//rest services
const restPedido = require('./api/rest.pedido');
const restWebhook = require('./api/rest.webhook');
const restUsuario = require('./api/rest.usuario');
const restFavorito = require('./api/rest.favorito');
const restProveedor = require('./api/rest.proveedor');
const restProducto = require('./api/rest.producto.js');
const restCatalogoEstado = require('./api/rest.catalogo.estado');
const restCatalogoMetodoPago = require('./api/rest.catalogo.metodo.pago');
const restCatalogoCategoriaProducto = require('./api/rest.catalogo.categoria');
const restResenia = require('./api/rest.resenia');

//services
const usuarioService = require('../services/usuario.service');
const usuarioStaffService = require('../services/usuario.staff.service');

const api = express.Router();

/***************** Public resources ***********************/

//rest full api for user
api.use('/webhook', restWebhook);

/* GET root api*/
api.get('/', (req, res) => {
	log.info(fileJS, 'Call success api.v.'+config.apiVersion+' in mode: ' + config.env);
	res.status(200).json({
		success: true,
		message: 'Call success api.v.'+config.apiVersion+' in mode: ' + config.env,
		mobile_version: config.MOBILE_VERSION
	});
});

/* POST Path que registra un nuevo usuario */
api.post('/registro', (req, res) => {

	// Se recupera la infomacion del body
	let usuario = req.body;

	// Se verifica al objeto
	if(usuario) {

		// Se invoca al servicio	
		usuarioService.registrarUsuario(usuario, (result) => {

			// Se verifica si no ocurrio un error
			if(result.success) {

				let jsonResult = {success: true};
				
				// Se verifica si el usuario existe
				if(result.usuario) {
					jsonResult.usuario = result.usuario;
					jsonResult.message = 'El usuario se encuentra registrado';
				} else {
					jsonResult.message = 'El usuario se registro correctamente';
					jsonResult.token = jwt.sign({email : usuario.email}, config.secret_jwt);//end generate token
				}
				
				return res.status(200).json(jsonResult);
			}

			log.error(fileJS, 'Error al registrar usuario: ', usuario.email);
			return res.status(500).json({success: false, message: 'Error al registrar al usuario'});
		});
	} else {
		log.error(fileJS, 'Error al registrar usuario params invalidos');
		return res.status(500).json({success: false, message: 'Parametros invalidos'});
	}
});

/* POST que recupera la contrasenia de un usuario */
api.post('/reset-password', (req, res) => {
	console.log(req.body.email)
	let email = req.body.email; // Se obtiene la informacion del usuario

	// Se verifica el objeto usuario
	if(email) {

		let usuario = {email: email};

		// Se invoca al metodo ue busca al usuario
		usuarioService.buscarPorEmail(usuario.email, (result) => {

			// Se verifica si no hay error
			if(result && result.success) {

				// Se verifica si existe el usuario y si es de origen local
				if(result.usuario) {

					// Object user
					let usuarioData = {
						email: result.usuario.email,
						imagen: result.usuario.imagen,
						idOrigen: result.usuario.idOrigen,
						apellidos: result.usuario.apellidos,
						fechaRegistro: result.usuario.fechaRegistro,
						nombreCompleto: result.usuario.nombreCompleto,
					};
					
					// Se verifica si es de tipo local
					if(result.usuario.idOrigen == 1) {
						
						// Se invoca el servicio de recuperar contrasenia
						usuarioService.recuperarContrasenia(usuario, (result) => {

							// Se verifica si el objeto 
							if(result && result.success) {
								return res.status(200).json({success: true, message: 'Se ha recuperado la contrasenia', usuario: usuarioData});
							} else {
								log.error(fileJS, 'Error al recuperar la contraseña: ', result);
								return res.status(500).json({success: false, message: 'Error al recuperar la contrasenia'});
							}
						});
					} else {
						return res.status(200).json({success: true, message: 'El usuario es de facebook', usuario: usuarioData});
					}
				} else {
					return res.status(200).json(result);
				}
			} else {
				log.error(fileJS, 'Error al recuperar la contraseña: ', result);
				return res.status(500).json({success: false, message: 'Error al recuperar la contrasenia'});
			}
		});
	} else {
		log.error(fileJS, 'Error al recuperar la contraseña params invalidos');
		return res.status(500).json({success: false, message: 'Parametros invalidos'});
	}
});

/***************** resource for authenticate for mobile and sell-it admin ***********************/
api.post('/authenticate', (req, res) => {

	// Se recupera la infomacion del body
	let usuario = req.body;

	// Se verifica si el objeto no esta vacio
	if(usuario) {

		//call service for check user on db
		usuarioService.buscarPorEmail(usuario.email, (result) => {
			
			// Se verifica si la repuesta fue correcta
			if(result.success) {

				let jsonResult = {success: true};
				let usuarioResult = result.usuario;

				// Se verifica si se obtiene los datos del usuario
				if(usuarioResult) {

					// Object user
					let usuarioData = {
						email: usuarioResult.email,
						imagen: usuarioResult.imagen,
						idOrigen: usuarioResult.idOrigen,
						apellidos: usuarioResult.apellidos,
						fechaRegistro: usuarioResult.fechaRegistro,
						nombreCompleto: usuarioResult.nombreCompleto,
					};

					// Se verifica si el usuario fue registro por facebook
					if(usuarioResult.idOrigen == 2) {
						
						jsonResult.message = 'El usuario es valido';
						jsonResult.usuario = usuarioData;
						// if user valid generate token
						jsonResult.token = jwt.sign({email : usuarioResult.email}, config.secret_jwt);//end generate token

						// Se invoca al servicio
						usuarioService.actualizarInformacion(usuario, function(response) {

							// Se verifica si no ocurrio un error
							if(result.success && !result.err) {
								jsonResult.usuario = usuario;
							}

							return res.status(200).json(jsonResult);
						});
					} else {

						// Se invoca al metodo que verifica la contrasenia
						usuarioResult.verificarPassword(usuario.password, (err, isMatch) => {

							// Se verifica si ocurrio un error o si la contrasenia no fue correcta
							if(err) {
								jsonResult.success = false;
								jsonResult.message = 'Error al validar el password';
								log.error(fileJS, 'Error al validar el password: ', err);
								return res.status(500).json(jsonResult);
							} else {

								jsonResult.usuario = usuarioData;

								// Se verifica si el password coinciden
								if(!isMatch) {
									jsonResult.success = true;
									jsonResult.message = 'Error de validacion de password';
									log.error(fileJS, 'Error de validacion de password');
								} else {
									jsonResult.message = 'El usuario es valido';
									// if user valid generate token
									jsonResult.token = jwt.sign({email : usuarioResult.email}, config.secret_jwt);//end generate token
								}

								return res.status(200).json(jsonResult);
							}
						});
					}
				} else {
					jsonResult.message = 'El usuario no se encuentra registrado.';
					return res.status(200).json(jsonResult);
				}
			} else {
				//return status and token
				log.error(fileJS, 'Error buscarPorEmail: ', result);
				return res.status(500).json({success: false, message: 'Error al registrar al usuario'});
			}
		});
	} else {
		log.error(fileJS, 'Params invalidos');
		return res.status(500).json({success: false, message: 'Parametros invalidos'});
	}
});

/***************** Staff sell-it authenticate for Dashboard panel *************************/
api.post('/staff-authenticate', (req, res) => {
	// Se recupera la infomacion del body
	let usuario = req.body;		
	// Se verifica si el objeto no esta vacio
	if(usuario) {
		//call service for check user on db
		usuarioStaffService.find(usuario, (result) => {				
			if (result.success === true && result.usuario) {// if user valid generate token
				let token = jwt.sign({email : usuario.email}, config.secret_jwt);//end generate token
				return res.status(200).json({
					success: true,
					token: token
				});
			}else{	
				//if user not found
				if (result.success) {
					return res.status(403).json({
						success: false,
						message: 'Email or password invalid, user not found'
					});					
				}

				//If err then Internal server error				
				log.error(fileJS, 'Internal server error when authenticate staff user');
				return res.status(500).json({
					success: false,
					message: 'Internal server error when authenticate staff user'
				});
			}
		});
	} else {
		log.error(fileJS, 'Params invalidos');
		return res.status(500).json({success: false, message: 'Parametros invalidos'});
	}
});

/***************** Middleware to check valid authentication ***********************/
/*api.use((req, res, next) => {

	//get token from body, header or other request
	let token = req.body.token || req.params.token || req.headers['x-access-token'];
	
	//result of authentication
	let jsonResult = {success: false, message: ''};
	
	//if exist token in request
	if (token) {
		
		//check key secret and credentiales
		jwt.verify(token, config.secret_jwt, (err, decoded) => {
			
			//if exist a error
			if(err) {

				if(err.name == 'TokenExpiredError') {
					jsonResult.message = 'Token expired';
					jsonResult.expired = true;
				} else {
					jsonResult.message = 'Authentication token invalid';	
				}

				return res.status(403).send(jsonResult);
			}
				
			//if token is valid save request
			req.decoded = decoded;

			//next call
			return next();			
		});		
	} else {

		//when token not provided
		jsonResult.message = 'Token not found';
		return res.status(403).json(jsonResult);
	}	
});*/

/***************** Middleware to check valid authentication ***********************/
api.use((req, res, next) => {

	//get token from body, header or other request
	let token = req.body.token || req.params.token || req.headers['x-access-token'];
	
	//result of authentication
	let jsonResult = {success: false, message: ''};
	
	//if exist token in request
	if (token) {
		
		//check key secret and credentiales
		jwt.verify(token, config.secret_jwt, (err, decoded) => {
			
			//if exist a error
			if(err) {

				if(err.name == 'TokenExpiredError') {
					jsonResult.message = 'Token expired';
					jsonResult.expired = true;
				} else {
					jsonResult.message = 'Authentication token invalid';	
				}

				return res.status(403).send(jsonResult);
			}
				
			//if token is valid save request
			req.decoded = decoded;

			//next call
			return next();			
		});		
	} else {
		//console.log("here")
		return next()
		//when token not provided
		//jsonResult.message = 'Token not found';
		//return res.status(403).json(jsonResult);
	}	
});

/***************** Private resources ***********************/

//rest full api for user
api.use('/usuario', restUsuario);

//rest full api for favoritos
api.use('/favorito', restFavorito);

//rest full api for producto
api.use('/producto', restProducto);

//rest full api for proveedor
api.use('/proveedor', restProveedor);

//rest full api for catalogo de categorias de productos
api.use('/categoria-producto', restCatalogoCategoriaProducto);

//rest full api for get catalogo de metodos de pago
api.use('/metodos-pago', restCatalogoMetodoPago);

//rest full api for get catalogo de metodos de pago
api.use('/estado', restCatalogoEstado);

//rest full api for get catalogo de metodos de pago
api.use('/pedido', restPedido);

//rest full api for reseña de productos
api.use('/resenia', restResenia);

//rest full api for return valid token info in client angular 2
api.get('/user-staff/me', (req, res) => {
	if (req.decoded) {
		return res.status(200).json({success: true, message: 'Success user staff me', usuario: req.decoded});
	}
	return res.status(403).json({success: false, message: 'Login not valid'});
});

module.exports = api;