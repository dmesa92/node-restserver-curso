const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const fs = require("fs");
const path = require("path");

const productos = 'productos',
    usuarios = "usuarios"

const { verificaToken } = require('../middlewares/autenticacion');


// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {
    //Parametros
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No hay archivos seleccionados"
            }
        });
    }

    //validaciones tipo
    let tiposValidos = [productos, usuarios];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son ' + tiposValidos.join(', '),
                tip: tipo
            }
        });

    }
    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    // Use the mv() method to place the file somewhere on your server
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });

    }

    //Cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //Aquí imagen cargada
        switch (tipo) {
            case usuarios:
                imagenUsuario(id, res, nombreArchivo);
                break;
            case productos:
                imagenProducto(id, res, nombreArchivo);

            default:
                break;
        }
    });

});

function imagenUsuario(idUsuario, res, nombreArchivo) {
    Usuario.findById(idUsuario, (err, user) => {
        if (err) {
            borrarArchivo(nombreArchivo, usuarios)
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!user) {
            borrarArchivo(nombreArchivo, usuarios)

            return res.status(400).json({
                ok: false,
                error: `el Usuario con ID: ${idUsuario} no existe`
            });
        }
        borrarArchivo(user.img, usuarios);

        user.img = nombreArchivo;
        user.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    })
}

function imagenProducto(idProducto, res, nombreArchivo) {

    Producto.findById(idProducto, (err, producto) => {
        if (err) {
            borrarArchivo(nombreArchivo, productos)
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            borrarArchivo(nombreArchivo, productos)

            return res.status(400).json({
                ok: false,
                error: `el producto con ID: ${idProducto} no existe`
            });
        }
        borrarArchivo(producto.img, productos);

        producto.img = nombreArchivo;
        producto.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });

}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;