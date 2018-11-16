'use strict';

// Daos
const catalogoCategoriaDao = require('../dao/catalogo.categoria.producto.dao');
const async = require('async')
module.exports = {
    
    /**
     * Funcion que obtiene el catalogo de caterogias en un array
     * @param  {Function} callback return result      
     */
    /*find: function (callback) {
        // Se invoca la funcion del modelo
        catalogoCategoriaDao.find((result) => {
            callback(result);
        });
    }*/

    find: function (req,res) {
        let categorias_padre = []
        let categorias_hijo = []
        let categorias_nieto = []
        let menu = []
        catalogoCategoriaDao.findAllFathers((result) => {
            console.log("***CATEGORIAS PADRE***")
            console.log(result)
            if (result.catalogo != null) {
                categorias_padre = result.catalogo
                async.eachOfSeries(categorias_padre, function (valor, key, callback) {
                    //categorias_hijo = []
                    console.log(valor)
                    if (valor != null) {
                        var menu1 = {
                            categoria_padre: valor.categoria,
                            id_categoria_padre: valor._id,
                            categorias_hijo: []
                        }
                        catalogoCategoriaDao.findAllChildrensByFather(valor.id, (result2) => {
                            console.log("***CATEGORIAS HIJO***")
                            console.log(result2)
                            if (result2.catalogo != null) {
                                categorias_hijo = result2.catalogo
                                async.eachOfSeries(categorias_hijo, function (valor2, key2, callback2) {
                                    categorias_nieto = []
                                    if (valor2 != null) {
                                        var submenu = {
                                            categoria_hijo: valor2.categoria,
                                            id_categoria_hijo: valor2._id,
                                            categorias_nieto: []
                                        }
                                        catalogoCategoriaDao.findAllGrandSonByFather(valor2.id, (result3) => {
                                            console.log("***CATEGORIAS NIETO***")
                                            console.log(result3)
                                            if (result3.catalogo != null) {
                                                categorias_nieto = result3.catalogo
                                                submenu.categorias_nieto = result3.catalogo
                                                menu1.categorias_hijo.push(submenu)
                                                callback2()
                                            }else{
                                                menu1.categorias_hijo.push(submenu)
                                                callback2("Error al obtener las categorias hijo")
                                            }
                                        });
                                    }else{
                                        callback2()
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err)
                                        callback("Error al obtener categorias")
                                    }else{
                                        menu.push(menu1)
                                        callback()   
                                    }
                                });
                            }else{
                                callback("Error al obtener las categorias hijo")
                            }
                        });
                    }else{
                        callback()
                    }
                }, function (err) {
                    if (err) {
                        console.log(err)
                        res.status(301)
                        res.json({
                            status: "failure",
                            message: "Error al obtener el catalogo de caterogias"
                        })
                    }else{
                        console.log("MENU FORMADO")
                        console.log(menu)
                        res.status(201)
                        res.json({
                            status: "success",
                            categorias: menu
                        })
                        //callback(null, propiedades_inmobiliario)
                    }
                    //console.log("process finish")
                });
            }else{
                res.status(301)
                res.json({
                    status: "failure",
                    message: "Error al obtener el catalogo de caterogias"
                })
            }
        });
        // Se invoca la funcion del modelo
        /*catalogoCategoriaDao.find((result) => {
            console.log(result)
            if (result.catalogo != null) {
                res.status(201)
                res.json({
                    status: "success",
                    categorias: result.catalogo
                })
            }
        });*/
    },
    findAllFathers: function (req,res) {
        // Se invoca la funcion del modelo
        catalogoCategoriaDao.findAllFathers((result) => {
            console.log(result)
            if (result.catalogo != null) {
                res.status(201)
                res.json({
                    status: "success",
                    categorias: result.catalogo
                })
            }
        });
    },
    findAllChildrensByFather: function (req,res) {
        var id_proveniente = req.params.id
        // Se invoca la funcion del modelo
        catalogoCategoriaDao.findAllChildrensByFather(id_proveniente, (result) => {
            console.log(result)
            if (result.catalogo != null) {
                res.status(201)
                res.json({
                    status: "success",
                    categorias: result.catalogo
                })
            }
        });
    },
    findAllGrandSonByFather: function (req,res) {
        var id_proveniente = req.params.id
        // Se invoca la funcion del modelo
        catalogoCategoriaDao.findAllGrandSonByFather(id_proveniente, (result) => {
            console.log(result)
            if (result.catalogo != null) {
                res.status(201)
                res.json({
                    status: "success",
                    categorias: result.catalogo
                })
            }
        });
    }
};