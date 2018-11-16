"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

let usuarioSchema = new Schema({
    nombreCompleto: {type: String},
    apellidos: {type: String},
    email: {type: String, required: [true, 'email requerido'], index: {unique: true}},
    password: {type: String},
    imagen: {type: String},
    fechaRegistro: {type: Date, required: [true, 'fecha de registro requerida']},
    direccionEnvio: {
    	calle: {type: String},
    	estado: {type: String},
    	telefono: {type: String},
    	municipio: {type: String},
    	numero: {type: String},
    	codigoPostal: {type: String},
    },
    idOrigen: {type: Number, required: [true, 'origen requerido']},
    estatusUsuario: {
    	type: Number, default: 1, required: [true, 'Estatus del usuario requerido']
    },
    customer: {
    	id: {type: String},
    	tokenId: {type: String}
    }
});

// Middleware save user
usuarioSchema.pre('save', function(next) {

	// User object
	let usuario = this;

	// only hash the password if it has been modified (or is new)
	if(!usuario.isModified('password')) return next();

	// generating the salt
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

		// If an error occurred while generating the salt
	    if(err) return next(err);

	    // hash the password using our new salt
	    bcrypt.hash(usuario.password, salt, (err, hash) => {

	    	// If an error occurred while generating the password
	        if(err) return next(err);

	        // override the cleartext password with the hashed one
	        usuario.password = hash;
	        next();
	    });
	});
});

// Middleware update user
usuarioSchema.pre('findOneAndUpdate', function(next) {

	// User object
	let query = this;
	let usuario = query.getUpdate();

	// only hash the password if it has been modified (or is new)
	if(!usuario.password) return next();

	// generating the salt
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

		// If an error occurred while generating the salt
	    if(err) return next(err);

	    // hash the password using our new salt
	    bcrypt.hash(usuario.password, salt, (err, hash) => {

	    	// If an error occurred while generating the password
	        if(err) return next(err);

	        // override the cleartext password with the hashed one
	        usuario.password = hash;
	        next();
	    });
	});
});

// Method that checks if the password is correct
usuarioSchema.methods.verificarPassword = function(password, callback) {

	// Compare the passwords
	bcrypt.compare(password, this.password, (err, isMatch) => {

    	// If an error occurred while verifying password
		if(err) return callback(err);
        
		callback(null, isMatch);
    });
};

module.exports = mongoose.model('usuario', usuarioSchema, 'usuario');