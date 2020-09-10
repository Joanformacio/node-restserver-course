//=======================
// Configuracion puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=======================
// Base Datos
//=======================
let urlDB;


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://CastNodeAtlas:ESYVh9950YxIjzHu@cluster0.kf2gp.mongodb.net/cafe';
}

process.env.URLDB = urlDB