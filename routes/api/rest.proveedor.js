'use strict';
const express = require('express');
//services
const proveedorService = require('../../services/proveedor.service');

const proveedorRouter = express.Router();

/* ------------------------ Middleware to validate POST insert new Proveedor ------------------------ */

/* ------------------------ POST insert new Proveedor ------------------------ */
proveedorRouter.post('/', (req, res) => {
	let proveedor = req.body.proveedor;	
	// Invoque service proveedor	
	proveedorService.registrar(proveedor, (result) => {
		if (result.err) {
			res.status(500).json({success: false, message: 'Error interno al registrar proveedor'});
		}else{
			if (result.success) {
				res.status(200).json({success: true, message: 'Proveedor registrado exitosamente'});				
			}else{
				res.status(200).json({success: false, message: 'Registro no permitido, este proveedor ya existe'});
			}
		}
	});
});

/* ------------------------ Get all Proveedores ------------------------ */
proveedorRouter.get('/all', (req, res) => {
	proveedorService.findAll((result) => {		
		if (result.err || !result.success) {
			return res.status(500).json({success: false, message: 'Error al consultar proveedores'});
		}		
		return res.status(200).json({success: true, message: 'Operacion exitosa', proveedores: result.proveedores});
	});
});

/* ------------------------ Get Proveedor por id ------------------------ */
proveedorRouter.get('/id/:id', (req, res) => {
	//Se obtiene el id del proveedor
	let idProveedor = req.params.id;
	//SE invoca al servicio para buscar al proveedor
	proveedorService.findById(idProveedor, (result) => {
		if (result.err || !result.success) {
			return res.status(500).json({success: false, message: 'Error al consultar proveedor por id'});
		}	
		return res.status(200).json({success: true, message: 'Operacion exitosa', proveedor: result.proveedor});
	});
});


/* ------------------------ PUT update Proveedor ------------------------ */
proveedorRouter.put('/', (req, res) => {
	let proveedor = req.body.proveedor;		
	// Invoque service proveedor	
	proveedorService.findByIdAndUpdate(proveedor, (result) => {
		if (result.err) {
			res.status(500).json({success: false, message: 'Error interno al actualizar proveedor'});
		}else{			
			res.status(200).json({success: true, message: 'Proveedor actualizado exitosamente'});
		}
	});
});

module.exports = proveedorRouter;