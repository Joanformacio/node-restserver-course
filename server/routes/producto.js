require('../config/config')
const express = require('express');
let Producto = require('../models/producto');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


app = express();

//=============================
//Mostrar todas las categorias
//=============================

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
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
                producto: productoDB
            })
        })
});

//=============================
//Mostrar una categoria s/su id
//=============================

app.get('/producto/:id', verificaToken, (req, res) => {
    //return one category
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    completed: false,
                    err: {
                        message: err.message
                    }
                })
            }


            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.json({
                ok: 'finded',
                producto: productoDB
            })
        })
});

//=============================
//Mostrar una categoria s/su id
//=============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    completed: false,
                    err: {
                        message: err.message
                    }
                })
            }

            /*if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'categoria no encontrada'
                    }
                })
            }*/

            res.json({
                ok: true,
                productos
            })

        })
});



//=============================
//Crea una producto
//=============================

app.post('/producto', verificaToken, (req, res) => {
    const body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: 'created',
            producto: productoDB
        })
    })
});

//====================================
//Actualiza un producto selecionado
//====================================

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let updateProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
    }

    Producto.findByIdAndUpdate(id, updateProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: err.message
                }
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        };
        res.json({
            ok: 'modificated',
            producto: productoDB
        })
    })
});

//=============================
//Mostrar todas los productos
//=============================

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //borrar fisicamente
    let id = req.params.id;

    Producto.findById(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        };
        productoBorrado.disponible = false;
        productoBorrado.save((err, pBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                completed: true,
                message: `El producto con id ${pBorrado.id} ha sido eliminado`,

            })

        })

    })
});


module.exports = app;