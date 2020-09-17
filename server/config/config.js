//=======================
// Configuracion puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=======================
// Vencimiento token
//=======================
process.env.CADUCIDAD_TOKEN = '48h';
//=======================
// SEED
//=======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//=======================
// Base Datos
//=======================
let urlDB;


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB


//=======================
// google client
//=======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1060715523498-634mot0ikcphmjhat54buog7s1999i0g.apps.googleusercontent.com'