 require('./config/config');

 const express = require('express');
 const mongoose = require('mongoose');

 const app = express();
 const bodyParser = require('body-parser');
 const colors = require('colors');




 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: false }))

 // parse application/json
 app.use(bodyParser.json()) //middleware
 app.use(require('./routes/usuario'))




 mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
     if (err) throw err;
     console.log(colors.blue('Base de datos UP'))
 });

 app.listen(process.env.PORT, () => {
     console.log("Escuchando  puerto", process.env.PORT)
 });