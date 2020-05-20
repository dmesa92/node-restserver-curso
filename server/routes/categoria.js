const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


let app = express();

let Categoria = require("../models/categoria");

// ============================
// Mostar todas las categorias 
// ============================

app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasBD) => {
            if (err) {
                res.status(500).json({ err: "Ha ocurrido un error." });
            }
            if (!categoriasBD) {
                res.status(400).json({ Categorias: "No se han encontrado categorias" });
            }
            res.json({ categoriasBD });

        });

});

// ============================
// Mostar 1 categoria por ID 
// ============================

app.get("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({ err: "Ha ocurrido un error." });
        }
        if (!categoriaBD) {
            return res.status(400).json({ Categorias: `No se han encontrado categorias para el id: ${id}` });
        }
        return res.json({ categoriaBD });
    });

});

// ============================
// Crear nueva categoria 
// ============================

app.post("/categoria", verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                err: "Ha ocurrido un error.",
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                error: "Ha ocurrido un error.",
                err
            });
        }
        // Devuelve la nueva categoria
        return res.json({ ok: true, Categoria: categoriaBD });
    });
});

// ============================
// Actualizar una categoria 
// ============================

app.put("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion,
        usuario: req.params.id
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!categoriaBD) {
            return res.status(400).json({ ok: false, err });
        }
        return res.json({ ok: true, categoria: categoriaBD });
    });
    // regresa la nueva categoria
});

// ============================
// eliminar una categoria 
// ============================

app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    // regresa la nueva categoria
    //solo admin puede borrar
    //borrado no lógico
    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!categoriaBD) {
            return res.status(400).json({ ok: false, err });
        }
        return res.json({ ok: true, estado: "La categoria ha sido borrada" });
    });
});
module.exports = app;