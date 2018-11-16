'use strict';
let config = {};

// Entorno de la aplicacion production o development;
config.env = 'production';
var cloudinary = require ("cloudinary")

//configuracion para entorno de desarrollo
if (config.env === 'production') {

	// configuración de cloudinary
	cloudinary.config ({ 
	   cloud_name : 'rodrigoibarra', 
	   api_key : 	'139992936421315', 
	   api_secret : 'jKEsilHMo_cnv0uNvtsT6khsINk'  
	})

	// Configuracion a la base de datos
	config.db = {
		debug: true,
		uri: 'mongodb://RodrigoIbarraci:creacionesinteligentes2019.@ds161183.mlab.com:61183/rodrigoibarradb',
		options: {
			server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
    		replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
		}
	};

	// Key para jwt
	config.secret_jwt = 'key_qa';

	// Configuracion para envio de correos
	config.mail = {
		transport: {			
			service: 'Gmail',
			auth: {
				user: 'notifyfoo@gmail.com',
				pass: 'notify2017'
			},
			debug: true
		},
		pathTemplates: 'views/templates/emails/'
	};

	//Host path (usado para linkear los assets en mails)
	config.hostPath = 'https://rodrigoibarraapp.herokuapp.com/';
	
	//key privada de conekta
	config.conekta = {
		apiVersion: '2.0.0',
		//apiKey: 'key_kSyNpKzn9WSgea1yzBVrJA',
		apiKey: 'key_kSyNpKzn9WSgea1yzBVrJA',
	};

	//Mail staff ecommerce
	config.mailStaff = 'rodrigoibarra@ibarrasanchez.com';

	//mail notificacion cron 
	config.mantenimiento = {
		email: 'creainte@gmail.com'
	}
	// pendiente
	config.DATOS_CONTACTO = {
		tel: '2223005518',
		email: 'rodrigoibarrasanchez@gmail.com'
	};
	config.CREACIONES_INTELIGENTES = {
		email: 'creainte@gmail.com'
	};
	config.fromData = {
		from: '"Rodrigo Ibarra App" <rodrigoibarra@ibarrasanchez.com>',
		user: 'rodrigoibarra@ibarrasanchez.com',
		password: "creacionesinteligentes2019.",
		host: "smtp.dreamhost.com"
	}
} else if(config.env === 'QA') { // Configuracion para QA
	// configuración de cloudinary
	cloudinary.config ({ 
	   cloud_name : 'rodrigoibarra', 
	   api_key : 	'139992936421315', 
	   api_secret : 'jKEsilHMo_cnv0uNvtsT6khsINk'  
	})

	// Configuracion a la base de datos
	config.db = {
		debug: true,
		uri: 'mongodb://RodrigoIbarraci:creacionesinteligentes2019.@ds161183.mlab.com:61183/rodrigoibarradb',
		options: {
			server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
    		replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
		}
	};

	// Key para jwt
	config.secret_jwt = 'key_qa';

	// Configuracion para envio de correos
	config.mail = {
		transport: {			
			service: 'Gmail',
			auth: {
				user: 'notifyfoo@gmail.com',
				pass: 'notify2017'
			},
			debug: true
		},
		pathTemplates: 'views/templates/emails/'
	};

	//Host path (usado para linkear los assets en mails)
	config.hostPath = 'https://rodrigoibarraapp.herokuapp.com/';
	
	//key privada de conekta
	config.conekta = {
		apiVersion: '2.0.0',
		//apiKey: 'key_kSyNpKzn9WSgea1yzBVrJA',
		apiKey: 'key_kSyNpKzn9WSgea1yzBVrJA',
	};

	//Mail staff ecommerce
	config.mailStaff = 'rodrigoibarra@ibarrasanchez.com';

	//mail notificacion cron 
	config.mantenimiento = {
		email: 'creainte@gmail.com'
	}
	// pendiente
	config.DATOS_CONTACTO = {
		tel: '2223005518',
		email: 'rodrigoibarrasanchez@gmail.com'
	};
	config.CREACIONES_INTELIGENTES = {
		email: 'creainte@gmail.com'
	};
	config.fromData = {
		from: '"Rodrigo Ibarra App" <rodrigoibarra@ibarrasanchez.com>',
		user: 'rodrigoibarra@ibarrasanchez.com',
		password: "creacionesinteligentes2019.",
		host: "mail.dreamhost.com",
		port: 587,
	}
} else { // configuracion para entorno de produccion
	// configuración de cloudinary
	cloudinary.config ({ 
	   cloud_name : 'rodrigoibarra', 
	   api_key : 	'139992936421315', 
	   api_secret : 'jKEsilHMo_cnv0uNvtsT6khsINk'  
	})

	// Configuracion a la base de datos
	config.db = {
		debug: true,
		uri: 'mongodb://RodrigoIbarraci:creacionesinteligentes2019.@ds161183.mlab.com:61183/rodrigoibarradb',
		options: {
			server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
    		replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
		}
	};

	// Key para jwt
	config.secret_jwt = 'key_qa';

	// Configuracion para envio de correos
	config.mail = {
		transport: {			
			service: 'Gmail',
			auth: {
				user: 'notifyfoo@gmail.com',
				pass: 'notify2017'
			},
			debug: true
		},
		pathTemplates: 'views/templates/emails/'
	};

	//Host path (usado para linkear los assets en mails)
	config.hostPath = 'https://rodrigoibarraapp.herokuapp.com/';
	
	//key privada de conekta
	config.conekta = {
		apiVersion: '2.0.0',
		//apiKey: 'key_kSyNpKzn9WSgea1yzBVrJA',
		apiKey: 'key_kSyNpKzn9WSgea1yzBVrJA',
	};

	//Mail staff ecommerce
	config.mailStaff = 'rodrigoibarra@ibarrasanchez.com';

	//mail notificacion cron 
	config.mantenimiento = {
		email: 'creainte@gmail.com'
	}
	// pendiente
	config.DATOS_CONTACTO = {
		tel: '2223005518',
		email: 'rodrigoibarra@ibarrasanchez.com'
	};
	config.CREACIONES_INTELIGENTES = {
		email: 'creainte@gmail.com'
	};
	config.fromData = {
		from: '"Rodrigo Ibarra App" <rodrigoibarra@ibarrasanchez.com>',
		user: 'rodrigoibarra@ibarrasanchez.com',
		password: "creacionesinteligentes2019.",
		host: "mail.dreamhost.com",
		port: 587,
	}
}

//Objeto que representa la configuracion necesaria para log4js
config.log4j = {
	appenders: [    	
	   	{ type: 'console', category: 'sell-it-app' },
    	{ type: 'file', filename: 'logs/sell-it-app.log', category: 'sell-it-app', maxLogSize: 20480, numBackups: 2, compress: true, encoding: 'utf-8'},
    	{ type: 'file', filename: 'logs/access.log', category: 'http', maxLogSize: 20480, numBackups: 2, compress: true, encoding: 'utf-8'}
    ]
};

// Dias que se enviara el pedido despues de la fecha
config.diasEntrega = 7;
config.compra = {
	descuento: 10, // El porcentaje de descuento
	costoEnvio: 50, // El costo de envio por producto
	descuentoAplicar: 1000 // El monto minimo para realizar el descuento
};
config.resenia = {
	offset: 0,
	noElementos: 10
};

config.cron = {
	start: true,
	timeZone: 'America/Mexico_City',
	cronTimeDesactivarProducto: '0 0 1,13 * * *', // 0 0 1,13 * * *
	//cronTimeDesactivarProducto: '*/5 * * * * *', // 0 0 1,13 * * *
}

config.apiVersion = 22;

config.MOBILE_VERSION = 12;

config.REFERENCIA = {
	banco: 'Cuenta Bancaria',
	empresa: 'Rodrigo Ibarra',
	noCuenta: '6361675807',
	clabe: '021180063616758077',
	rfc: '',
	sucursal: ''
}
module.exports = config;