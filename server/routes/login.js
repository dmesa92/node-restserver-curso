const express = require('express');

const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');



const Usuario = require('./../models/usuario');

const app = express();

app.post("/login", (req, resp) => {

    let body = req.body;

    Usuario.findOne({ email: body.email } /*, "password email"*/ )
        .exec((err, usuario) => {
            if (err) {
                resp.status(500).json({
                    err

                });
            }
            if (!usuario) {
                resp.status(400).json({
                    ok: false,
                    err: {
                        message: 'USUARIO o contraseña incorrectos'
                    }

                });
            }
            if (!bcrypt.compareSync(body.password, usuario.password)) {
                resp.status(400).json({
                    ok: false,
                    err: {
                        message: 'USUARIO o contraseña incorrectos'
                    }

                });
            }
            let token = jwt.sign({
                usuario
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            resp.json({
                ok: true,
                usuario,
                token
            });

        })

});

module.exports = app;