'use strict';

// Cloundinary client
const cloudinary = require('cloudinary');
const config = require('../config');

//load config to cloudinary
cloudinary.config(config.cloudinary);

module.exports = {
	upload: function (file, callback){
		cloudinary.uploader.upload(file.path, function (result){
			callback(result);
		},{
			crop: 'fill',
			width: 320,
			height: 320
		});
	},

	delete: function (imageId, callback){
		cloudinary.uploader.destroy(imageId, function (result){
			callback(result);
		});
	},

	uploadFolder: function (file, options, callback) {
		cloudinary.uploader.upload(file.path, function (result) {
			callback(result);
		}, options);
	},
};