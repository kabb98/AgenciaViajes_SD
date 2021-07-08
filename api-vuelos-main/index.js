'use strict' //js más estricto

const port = process.env.PORT || 3700;

//Imports
const express = require('express');
const logger = require('morgan');
const mongojs = require('mongojs');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const tokenService = require('./services/token.service');
const mongoose = require('mongoose');

const opciones = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
}


//URL DB
const URL_DB = "localhost:27017/coches";

const connectionString = 'mongodb+srv://kenny:kenny123@sd.4pt4m.mongodb.net/api-rest?retryWrites=true&w=majority';


//Crea una app con express
const app = express();

//var db = mongojs(URL_DB);
var db = mongojs(connectionString);

var id = mongojs.ObjectID;  //Id textual -> Objeto mongojs 


//Middleware
app.use(logger('dev')); //Logger basico
app.use(express.json());    //Convierte a un objeto verdadero JSON
app.use(express.urlencoded({extended : false}));    //Convierte el texto de un formulario a un JSON
app.use(helmet());



//Autorizacion
function auth(req, res, next)
{
    //Si no hay token
    if(!req.headers.authorization)
    {
        res.status(401).json({
            result: 'Fallo',
            mensaje: 'No has enviado ningun token en la cabecera'
        });
        return next(new Error("Falta token de autorización"));
    }

    const queToken = req.headers.authorization.split(" ")[1];

    //Decodificamos el token
    tokenService.decodificaToken(queToken).then(userId => {
        return next();
    }).catch(err => {
        res.status(401).json({
            result: 'Fallo',
            mensaje: 'Acceso no autorizado a este servicio'
        });
        return next(err);
    });
}

//FORMATO VUELO
//origen:
//destino:
//fechaIda:
//fechaVuelta:
//precio:

//Routes y Controllers

//Permite mostrar todos los vuelos de la base de datos
app.get('/vuelos', auth, (req, res, next) => {

    console.log('Entra en el get');
    //Con find buscamos todo lo que haya en esa coleccion
    db.collection('vuelos').find({
        "reservado": false
    },(err, vuelos)=> {
        if (err) return next(err); //propagamos el error
        console.log(vuelos);
        res.json({
            result: 'OK',
            elementos: vuelos
        });
    });
});


//Permite mostrar los datos de un vuelo por id
app.get('/vuelos/:id', auth, (req, res, next) => {
    const queId = req.params.id;
    
    //Con find buscamos todo lo que haya en esa coleccion
    db.collection('vuelos').findOne({_id: id(queId)} ,(err, vuelo) =>
    {
        if(err) return next(err);
        console.log(vuelo);

        //Devolvemos el vuelo
        res.json({
            result: 'OK',
            elemento: vuelo
        });

    });
});


//Permite crear un vuelo
app.post('/vuelos', auth, (req, res, next) =>{
    //El nuevo objeto esta en el body
    const nuevoElemento = req.body;


    const vuelo = {
        origen: nuevoElemento.origen,
        destino: nuevoElemento.destino,
        fechaIda: nuevoElemento.fechaIda,
        fechaVuelta: nuevoElemento.fechaVuelta,
        precio: nuevoElemento.precio,
        reservado: false
    }

    //Save guarda el nuevo elemento 
    db.collection('vuelos').save( vuelo, (err, elementoGuardado)=>
    {
        if(err) return next(err);
        res.status(201).json({
            result: 'OK',
            coleccion: 'vuelos',
            elemento: elementoGuardado
        });

    });
});

//Permite modificar un vuelo
app.put('/vuelos/:id', auth,(req, res, next) => {
    const queId = req.params.id;
    const nuevoElemento = req.body;

    db.collection('vuelos').update(
        {_id: id(queId)},
        {$set: nuevoElemento},
        {safe: true, multi: false},
        (err, result) => {
            if(err) return next(err);

            console.log(result);
            res.json({
                correcto: 'OK Modificado',
                coleccion: 'vuelos',
                _id: queId
            });
        }
    );
});

//Permite borrar un vuelo de la BD
app.delete('/vuelos/:id', auth, (req, res, next) => {
    const queId = req.params.id;

    db.collection('vuelos').remove(
        {_id: id(queId)},
        (err, result) => {
            if(err) return next(err);

            console.log(result);

            res.json({
                correcto: 'OK Borrado',
                coleccion: 'vuelos',
                _id: queId,
                resultado: result
            });
        }
    );
});

/*
mongoose.Promise = global.Promise;
mongoose.connect(connectionString, { useNewUrlParser: true,useUnifiedTopology: true  }).
then(() => {
    console.log('La conexion a la BD se ha establecido');
    https.createServer(opciones, app).listen(port, () =>{
        console.log(`API REST ejecutandose en http://localhost:${port}`);
    });

}).catch(err => console.log(err));
*/
https.createServer(opciones, app).listen(port, () =>{
    console.log(`API REST ejecutandose en http://localhost:${port}`);
});