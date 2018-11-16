'use strict';

const nodemailer = require('nodemailer');
const config = require('../config.js');
//logs
const log4js = require('log4js'),
	log = log4js.getLogger('kitchen'),
	fileJS = 'mail.service > ';

const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


// create reusable transporter object using the default SMTP transport
//let transporter = nodemailer.createTransport(config['mail'].transport);
//let mailOptions = {from: '"Creaciones Inteligentes Ecommerce" <creainte@gmail.com>'};
config.fromData = {
	from: '"Rodrigo Ibarra App" <rodrigoibarra@ibarrasanchez.com>',
		user: 'rodrigoibarra@ibarrasanchez.com',
		password: "creacionesinteligentes2019.",
		host: "smtp.dreamhost.com"
}
let transporter = nodemailer.createTransport({
	host: config.fromData.host,
	port: config.fromData.port,
	auth: {
		user: config.fromData.user,
		pass: config.fromData.password
	}
})
let mailOptions = {
	from: config.fromData.from,
	to: config.mailStaff,
	subject: "",
	text: "",
	html: null
}
/**
 * Funcion que lee un archivo html
 * @param  {String}   path     ruta del archivo a leer
 * @param  {Function} callback retorna el resultado del archivo 
*/

function readHTMLFile(path, callback) {
	
	//read file
	fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
		// Se verifica si ocurrio un error
        if (err) {
        	log.error(fileJS, 'Error readHTMLFile: ', err);
            callback(err);
        } else {
            callback(null, html);
        }
    });
}

module.exports = {

	/**
	 * Funcion que envia un correo informando que su registro fue exitoso
	 * @param  {Object} mailData configuracion del correo
	 */
	bienvenida: function(mailData) {
		//get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'bienvenida.html');
		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {
				// complile html file
				let template = handlebars.compile(html);
				
				//define data for template html file
				let replacements = {
					email: mailData.usuario.email,
					hostPath: config.hostPath
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = '¡Bienvenido a Rodrigo Ibarra App!';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error bienvenida sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	/**
	 * Funcion que envia un correo con la nueva contrasenia
	 * @param  {Object} mailData configuracion del correo
	 */
	recuperarContrasenia: function(mailData) {
		//get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'recuperarContrasenia.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					hostPath: config.hostPath,
					email: mailData.usuario.email,
					password: mailData.usuario.password,
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = '¡Recuperación de contraseña!';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error recuperarContrasenia sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	reciboPagoEfectivo: function(mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'reciboPagoEfectivo.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					email: mailData.email,
					monto: mailData.monto,
					hostPath: config.hostPath,
					referencia: mailData.referencia,
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = '¡Recibo de pago!';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error reciboPagoEfectivo sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	reciboPagoTransferencia: function(mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'reciboPagoTransferencia.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					bank: mailData.bank,
					email: mailData.email,
					clabe: mailData.clabe,
					monto: mailData.monto,
					hostPath: config.hostPath
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = '¡Recibo de pago!';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error reciboPagoTransferencia sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	confirmacionPago: function(mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'notificarPago.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					monto: mailData.monto,
					email: mailData.email,
					hostPath: config.hostPath,
					productos: mailData.productos,
					metodoPago: mailData.metodoPago,
					diasEntrega: mailData.diasEntrega
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = '¡Su pago fue aprobado!';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error confirmacionPago sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	notificarErrorDesactivacionProducto: function(mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'notificarErrorDesactivacionProducto.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					email: mailData.email,
					error: mailData.error
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = 'Le notificamos que ha ocurrido un error';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error notificarErrorDesactivacionProducto sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	notificarDesactivacionProducto: function(mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'notificarDesactivacionProducto.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					email: mailData.email,
					productos: mailData.listaProductos,
					totalProductos: mailData.listaProductos.length
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
			    mailOptions.subject = 'Productos desactivados';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error notificarDesactivacionProducto sendMail: ', error);
				        return console.log(error);
				    }

				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	/**
	 * Mail de notificacion a staff Sell-it cuando sucede una compra
	 * @param  {JSON} mailData opciones del email	 
	 */
	notificacionCompraStaff: function(mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'notificacionCompraStaff.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if(html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {					
					pedido: mailData.pedido,
					metodoPago: mailData.metodoPago,
					hostPath: config.hostPath				
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData.to;
			    mailOptions.subject = 'Nueva compra en Rodrigo Ibarra App!!';
			    mailOptions.html = htmlToSend;

			    // send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    
				    // Se verifica si ocurrio un error
				    if (error) {
				    	log.error(fileJS, 'Error notificacionCompraStaff sendMail: ', error);
				        return false;
				    }

				    log.info('Message notificacion compra to: '+ mailData.to +' %s sent: %s', info.messageId, info.response);
				});
			}else{
				log.error(fileJS, 'Error notificacionCompraStaff : ', err);
				return false;
			}
		});
	},

	notificacionPrepago: function (mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'ordenPrepago.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if (html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					email: mailData.email,
					monto: mailData.monto,
					hostPath: config.hostPath,
					referencia: mailData.referencia,
					datosContacto: mailData.datosContacto
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
				mailOptions.subject = 'Rodrigo Ibarra App información de prepago';
				mailOptions.html = htmlToSend;

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {

					// Se verifica si ocurrio un error
					if (error) {
						console.log("No se pudo enviar el correo")
						log.error(fileJS, 'Error notificacionPrepago sendMail: ', error);
						return console.log(error);
					}

					console.log('Message notificacionPrepago %s sent: %s', info.messageId, info.response);
				});
			}
		});
	},

	notificacionPedidoPrepagoStaff: function (mailData) {
		// get absoulte path to template
		let absolutePath = path.resolve(config['mail'].pathTemplates + 'notificarPedidoPrepagoStaff.html');

		//call function to read html file
		readHTMLFile(absolutePath, (err, html) => {

			//if read file success
			if (html) {

				let template = handlebars.compile(html); // complile html file

				//define data for template html file
				let replacements = {
					email: mailData.email,
					monto: mailData.monto,
					hostPath: config.hostPath,					
					pedido: mailData.pedido
				};

				//send data to html template
				let htmlToSend = template(replacements);

				//options for body mail
				mailOptions.to = mailData['options'].to;
				mailOptions.subject = 'Rodrigo Ibarra App Nueva Orden';
				mailOptions.html = htmlToSend;

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {

					// Se verifica si ocurrio un error
					if (error) {
						log.error(fileJS, 'Error notificacionPedidoPrepagoStaff sendMail: ', error);
						return console.log(error);
					}

					console.log('Message notificacionPedidoPrepagoStaff %s sent: %s', info.messageId, info.response);
				});
			}
		});
	}
};