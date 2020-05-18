//====================================
//puerto
//====================================

process.env.PORT = process.env.PORT || 3000;

//====================================
//Entorno
//====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================================
//Base de datos
//====================================

let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = 'mongodb+srv://dmesa:NeiM..4tGwHFWd6@cluster0-gb28e.mongodb.net/test?retryWrites=true&w=majority';

process.env.URLDB = urlDB






//'mongodb://localhost:27017/cafe'