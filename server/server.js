const { PORT } = require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json()) //middleware

// respond with "hello world" when a GET request is made to the homepage
app.get('/usuario', function(req, res) {
    res.json('esto es get');
});


app.post('/usuario', function(req, res) {

    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "Nombre requerido"
        })
    } else {
        res.json({
            persona: body
        });
    }


});

app.put('/usuario', function(req, res) {
    res.json('esto es put');
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    res.json({ id });
});

app.delete('/usuario', function(req, res) {
    res.json('esto es delete');
});




app.listen(PORT, () => {
    console.log("Escuchando  puerto", PORT)
});