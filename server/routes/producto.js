const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require("../models/producto");

// ============================
// Mostar todas las productos 
// ============================

app.get("/producto", verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    err
                });
            }
            if (!productosBD) {
                return res.status(400).json({
                    error: true,
                    productosBD: "No se han encontrado productos"
                });
            }
            return res.status(200).json({
                error: false,
                productosBD
            });
        })

});

// ============================
// Mostar 1 producto por ID 
// ============================

app.get("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate("categoria", "descripcion")
        .populate("usuario", "nombre")
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    err
                });
            }
            if (!productosBD) {
                return res.status(400).json({
                    error: true,
                    productosBD: `No se han encontrado productos para el ID: ${id}`
                });
            }
            return res.status(200).json({
                error: false,
                productosBD
            });
        })
});
// ============================
// Buscar producto 
// ============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    error: true,
                    productoBD: `No se han encontrado productos para el ID: ${id}`
                });
            }
            return res.status(200).json({
                error: false,
                productoBD
            });
        })


});

// ============================
// Crear nueva producto 
// ============================

app.post("/producto", verificaToken, (req, res) => {
    let body = req.body;
    producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                error: true,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                error: true,
                err
            });
        }
        return res.status(201).json({
            error: false,
            productoBD
        });
    })

});

// ============================
// Actualizar una producto 
// ============================

app.put("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let productoModificar = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }
    Producto.findByIdAndUpdate(id, productoModificar, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                error: true,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                error: true,
                err: {
                    mesagge: `el id: ${id} no existe`
                }
            });
        }
        return res.status(200).json({
            error: false,
            productoBD
        });
    });

});

// ============================
// eliminar una producto 
// ============================

app.delete("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                error: true,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                error: true,
                err
            });
        }
        return res.status(200).json({
            error: false,
            productoBD
        });
    });
    //disponible false
});
/** */


module.exports = app;