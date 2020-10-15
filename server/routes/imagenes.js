const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImagen } = require('./../middlewares/autenticacion')

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImagen, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let noImagePath = path.resolve(__dirname, '../assets/no-imagen.jpg');
    let pahtImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pahtImagen)) {
        res.sendFile(pahtImagen);
    } else {
        res.sendFile(noImagePath); //para que sendFile funcione, debe darse el path absoluto
    }

});


module.exports = app;