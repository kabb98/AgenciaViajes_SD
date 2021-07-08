'use strict' //js más estricto

const port = process.env.PORT || 3600;

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

const connectionString = 'mongodb+srv://kenny:kenny123@sd.4pt4m.mongodb.net/api-rest?retryWrites=true&w=majority';

//Crea una app con express
const app = express();

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



//Routes y Controllers
//Permite mostrar todos los hoteles de la base de datos
app.get('/hoteles', auth, (req, res, next) => {
    //Con find buscamos todo lo que haya en esa coleccion
    db.collection('hoteles').find({
        "reservado": false
    },(err, hoteles)=> {
        if (err) return next(err); //propagamos el error
        console.log(hoteles);
        res.json({
            result: 'OK',
            elementos: hoteles
        });
    });
});


//Permite mostrar los datos de un hotel por id
app.get('/hoteles/:id',/* auth,*/ (req, res, next) => {
    const queId = req.params.id;
    
    //Con find buscamos todo lo que haya en esa coleccion
    db.collection('hoteles').findOne({_id: id(queId)} ,(err, hotel) =>
    {
        if(err) return next(err);
        console.log(hotel);

        //Devolvemos el hotel
        res.json({
            result: 'OK',
            coleccion: 'hoteles',
            elemento: hotel
        });

    });
});

//FORMATO HOTEL
//nombre:
//nHabitacion:
//ciudad:
//fecha:
//precio:

//Permite crear un hotel
app.post('/hoteles', /*auth,*/ (req, res, next) =>{
    //El nuevo objeto esta en el body
    const nuevoElemento = req.body;

    const hotel = {
        nombre: nuevoElemento.nombre,
        numHab: nuevoElemento.numHab,
        fecha: nuevoElemento.fecha,
        ciudad: nuevoElemento.ciudad,
        precio: nuevoElemento.precio,
        reservado: false
    }


    //Save guarda el nuevo elemento 
    db.collection('hoteles').save( hotel, (err, elementoGuardado)=>
    {
        if(err) return next(err);
        res.status(201).json({
            result: 'OK',
            coleccion: 'hoteles',
            elemento: elementoGuardado
        });

    });
});

//Permite modificar un hotel
app.put('/hoteles/:id', /*auth,*/ (req, res, next) => {
    const queId = req.params.id;
    const nuevoElemento = req.body;

    db.collection('hoteles').update(
        {_id: id(queId)},
        {$set: nuevoElemento},
        {safe: true, multi: false},
        (err, result) => {
            if(err) return next(err);

            console.log(result);
            res.json({
                correcto: 'OK',
                coleccion: 'hoteles',
                _id: queId
            });
        }
    );
});

app.put('/hoteles/updateBooking/:id'), /*auth,*/ (req, res, next) => {
    const queId = req.params.id;
    const nuevoElemento = req.body;

    db.collection('hoteles').update(
        {_id: id(queId)},
        {$set: nuevoElemento},
        {safe: true, multi: false},
        (err, result) => {
            if(err) return next(err);

            console.log(result);
            res.json({
                correcto: 'OK',
                coleccion: 'hoteles',
                _id: queId
            });
        }
    );
};

//Permite borrar un hotel de la BD
app.delete('/hoteles/:id', auth, (req, res, next) => {
    const queId = req.params.id;

    db.collection('hoteles').remove(
        {_id: id(queId)},
        (err, result) => {
            if(err) return next(err);

            console.log(result);

            res.json({
                correcto: 'OK Borrado',
                _id: queId,
                resultado: result
            });
        }
    );
});

https.createServer(opciones, app).listen(port, () =>{
    console.log(`API REST ejecutandose en http://localhost:${port}`);
});