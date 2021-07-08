'use strict' //js más estricto

const port = process.env.PORT || 3500;

//Imports
const express = require('express');
const logger = require('morgan');
const mongojs = require('mongojs');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const tokenService = require('./services/token.service');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const opciones = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
}

app.use(cors());

//req.url = req.url.replace('http://', 'https://');



const connectionString = 'mongodb+srv://kenny:kenny123@sd.4pt4m.mongodb.net/api-rest?retryWrites=true&w=majority';


//Crea una app con express

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

//FORMATO VEHICULO
//nombre:
//origen:
//destino:
//fechaIda:
//fechaVuelta:
//precio:

//Routes y Controllers

//Permite mostrar todos los coches de la base de datos
app.get('/coches', auth, (req, res, next) => {

    //Con find buscamos todo lo que haya en esa coleccion
    db.collection('coches').find({
        "reservado": false
    },(err, coches)=> {
        if (err) return next(err); //propagamos el error
        console.log(coches);
        return res.json({
            result: 'OK',
            elementos: coches
        });
    });
});


//Permite mostrar los datos de un coche por id
app.get('/coches/:id', /*auth,*/ (req, res, next) => {
    const queId = req.params.id;
    
    //Con find buscamos todo lo que haya en esa coleccion
    db.collection('coches').findOne({_id: id(queId)} ,(err, coche) =>
    {
        if(err) return next(err);
        console.log(coche);

        //Devolvemos el coche
        res.json({
            result: 'OK',
            elemento: coche
        });

    });
});


//Permite crear un coche
app.post('/coches', /*auth,*/(req, res, next) =>{
    //El nuevo objeto esta en el body
    const nuevoElemento = req.body;

    const coche = {
        nombre: nuevoElemento.nombre,
        origen: nuevoElemento.origen,
        destino: nuevoElemento.destino,
        fechaIda: nuevoElemento.fechaIda,
        fechaVuelta: nuevoElemento.fechaVuelta,
        precio: nuevoElemento.precio,
        reservado: false
    }


    //Save guarda el nuevo elemento 
    db.collection('coches').save( coche, (err, elementoGuardado)=>
    {
        if(err) return next(err);
        res.status(201).json({
            result: 'OK',
            coleccion: 'coches',
            elemento: elementoGuardado
        });

    });
});

//Permite modificar un coche
app.put('/coches/:id', auth, (req, res, next) => {
    const queId = req.params.id;
    const nuevoElemento = req.body;
    console.log(nuevoElemento);
    db.collection('coches').update(
        {_id: id(queId)},
        {$set: nuevoElemento},
        {safe: true, multi: false},
        (err, result) => {
            if(err) return next(err);

            console.log(result);
            res.json({
                correcto: 'OK Modificado',
                coleccion: 'coches',
                _id: queId
            });
        }
    );
});


//Devuelve los coches reservador de un usuario
app.get('/cochesUsuario/:id', auth, (req, res, next) => {
    const queId = req.params.id;
    console.log('User id: ' + queId);


    db.collection('coches').find({
        'client': queId
            
    },(err, coches)=> {
        if (err) return next(err); //propagamos el error
        console.log(coches);
        return res.json({
            result: 'OK',
            elementos: coches
        });
    });
});

//Permite borrar un coche de la BD
app.delete('/coches/:id', /*auth,*/ (req, res, next) => {
    const queId = req.params.id;

    db.collection('coches').remove(
        {_id: id(queId)},
        (err, result) => {
            if(err) return next(err);

            console.log(result);

            res.json({
                correcto: 'OK Borrado',
                coleccion: 'coches',
                _id: queId
            });
        }
    );
});


https.createServer(opciones, app).listen(port, () =>{
    console.log(`API REST ejecutandose en http://localhost:${port}/api/{colecciones}/{id}`);
});