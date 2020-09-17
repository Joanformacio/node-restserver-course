require('../config/config')
const express = require('express');
let Categoria = require('../models/categoria');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


app = express();

//=============================
//Mostrar todas las categorias
//=============================

app.get('/categorias', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err.message
                    }
                })
            }

            res.json({
                ok: 'finded',
                categorias
            })
        })
});

//=============================
//Mostrar una categoria s/su id
//=============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    //return one category
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                completed: false,
                err: {
                    message: err.message
                }
            })
        }


        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            })
        }

        res.json({
            ok: 'finded',
            categoria
        })
    })
});

//=============================
//Crea una categoria
//=============================

app.post('/categoria', verificaToken, (req, res) => {
    const body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: 'created',
            categoria: categoriaDB
        })
    })
});

//====================================
//Actualiza una categoria selecionada
//====================================

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let updateCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, updateCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: 'modificated',
            categoria: categoriaDB
        })
    })
});

//=============================
//Mostrar todas las categorias
//=============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //borrar fisicamente
    let id = req.params.id;
    Categoria.findOneAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        };

        res.json({
            completed: true,
            message: `la categoria con id ${categoriaBorrada.id} ha sido eliminada`
        })
    })
});


module.exports = app;