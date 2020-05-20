const express = require("express");

const fs = require("fs");

const path = require("path");

let app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    //Tipos disponibles
    let tiposValidos = ['productos', 'usuarios'];
    //Si no se encuentra en el listado de disponible, devolvemos error.
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ error: "error" })
    }
    //Preparamos la ruta de la imagen.
    let imageReturn = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    //Si no existe la ruta, será la establecida por defecto
    if (!fs.existsSync(imageReturn)) {
        imageReturn = path.resolve(__dirname, '../assets/no-image.jpg');
    }
    return res.sendFile(imageReturn);
});


module.exports = app;