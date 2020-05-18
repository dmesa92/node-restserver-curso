const express = require('express')

const Usuario = require('./../models/usuario');
const app = express();

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const _ = require("underscore");

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);

    Usuario.find({ estado: true }, "nombre email role estado google img")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarios
            })
        })
});
app.get('/usuario/count', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);

    Usuario.count({ estado: true })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarios
            })
        })
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });
})

app.post('/usuario/masivo', function(req, res) {
    let body = req.body;
    altaUsuarioMasivo(body, (err => {
        console.log(err);
    }))
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let camposActualizables = ["nombre", "email", "img", "role", "estado"];
    let body = _.pick(req.body, camposActualizables);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})

app.delete('/usuario/:id', function(req, res) {
    let estado = false;
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado }, { new: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

function altaUsuarioMasivo(body) {
    for (let index = 1; index <= 15; index++) {
        let usuario = new Usuario({
            nombre: body.nombre + index,
            email: body.email + index,
            password: bcrypt.hashSync(body.password, salt),
            role: body.role
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                console.log("no hecho", usuarioDB);

            }
            //usuarioDB.password = null;
            console.log("hecho", usuarioDB);

        });

    }


}

module.exports = app;