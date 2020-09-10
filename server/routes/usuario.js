const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();



app.get('/usuarios', function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let estadoUser = {
        estado: true
    }

    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role, estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: 'finded',
                    usuarios,
                    cuantos: conteo
                })
            })

        })

});


app.post('/usuario', function(req, res) {

    const { nombre, email, password, role } = req.body;
    let usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: 'created',
            ususario: usuarioDB
        })
    });

});

app.put('/usuario', function(req, res) {
    res.json('esto es put');
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: 'modificated',
            ususario: usuarioDB
        })
    });

})





app.delete('/usuario/:id', function(req, res) {
    const id = req.params.id;
    const cambioEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ko: 'this user was eliminated',
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: 'deleted',
            ususario: usuarioBorrado
        })
    });
});

module.exports = app;