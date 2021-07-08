'use strict' //js más estricto
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const port = process.env.PORT || 5000;
//const USER_URL = 'https://localhost:3300';
const BOOKING_URL = 'https://localhost:3900';
const CAR_URL = 'https://172.20.43.99:3500';
const FLIGHT_URL = 'https://172.20.43.99:3700';
const HOTEL_URL = 'https://172.20.43.99:3600';

//Imports
const express = require('express');
const logger = require('morgan');
const mongojs = require('mongojs');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const tokenService = require('./services/token.service');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cors = require('cors');
const passService = require('./services/pass.service');
const moment = require('moment');

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
app.use(express.urlencoded({ extended: false }));    //Convierte el texto de un formulario a un JSON
app.use(helmet());
app.use(cors());


//Autorizacion
function auth(req, res, next) {
    //Si no hay token
    if (!req.headers.authorization) {
        res.status(401).json({
            result: 'Fallo',
            mensaje: 'No has enviado ningun token en la cabecera'
        });
        return next(new Error("Falta token de autorización"));
    }

    //Bearer OFDSBAOÑAFSASLdhasdfbjkfds
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
app.post('/registro', (req, res, next) => {

    const nuevoElemento = req.body;
    const newUser = {
        email: nuevoElemento.email,
        nombre: nuevoElemento.nombre,
        password: nuevoElemento.password,
        fechaRegistro: moment().unix(),
        ultimoLogeo: moment().unix()
    }


    db.collection('usuarios').findOne({ email: newUser.email }, (err, userGuardado) => {
        if (err) return next(err);

        //Si ya existe el usuario -> Lanzamos error
        if (userGuardado) {
            res.status(401).json({
                mensaje: 'El email ya está en uso'
            });
        }
        else {
            //Hasheamos la contraseña
            passService.encryptPassword(newUser.password)
                .then(hashedPass => {
                    newUser.password = hashedPass;
                    db.collection('usuarios').save(newUser, (err, elementoGuardado) => {
                        if (err) return next(err);
                        const token = tokenService.crearToken(newUser);
                        return res.status(201).json({
                            token: token
                        });
                    });
                });
        }
    });
});

app.get('/getUsuario', auth, (req, res) => {
    const queToken = req.headers.authorization.split(" ")[1];

    //Decodificamos el token
    tokenService.decodificaToken(queToken).then(userId => {
        db.collection('usuarios').findOne({ _id: id(userId) }, (err, user) => {
            if (err) return next(err);
            console.log('El usuario es: ' + user);
            return res.status(201).json({
                usuario: user
            });
        });
    });
});


app.put('/editProfile/:id', (req, res, next) => {
    const queId = req.params.id;

    const nuevoElemento = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password
    }
    db.collection('usuarios').findOne({ email: nuevoElemento.email }, (err, userGuardado) => {
        if (err) return next(err);

        //Si ya existe el usuario -> Lanzamos error
        if (userGuardado) {
            res.status(401).json({
                mensaje: 'El email ya está en uso'
            });
        }
        else {
            passService.encryptPassword(nuevoElemento.password)
                .then(hashedPass => {
                    nuevoElemento.password = hashedPass;
                    const ultimoInicioSesion = {
                        ultimoLogeo: moment().unix()
                    }
                    const userAux = {};
                    userAux._id = queId;
                    const token = tokenService.crearToken(userAux);
                    nuevoElemento.ultimoInicioSesion = ultimoInicioSesion;
                    //Actualizamos el ultimo inicio de sesion
                    db.collection('usuarios').update(
                        { _id: id(queId) },
                        { $set: nuevoElemento },
                        { safe: true, multi: false },
                        (err, result) => {
                            if (err) return next(err);
                            return res.json({
                                token: token
                            });
                        });
                });
        }
    });
});


app.post('/iniciarSesion', (req, res, next) => {
    const datosLogin = req.body;
    db.collection('usuarios').findOne({ email: datosLogin.email }, (err, user) => {
        //Si existe el usuario miramos que la contraseña es correcta
        if (user) {
            passService.comparePassword(datosLogin.password, user.password)
                .then(passCorrect => {
                    //Si la compacion es correcta -> Creamos un token
                    if (passCorrect) {
                        //Token
                        const token = tokenService.crearToken(user);

                        const queId = user._id;
                        //Actualizar ultimo inicio de sesion
                        const ultimoInicioSesion = {
                            ultimoLogeo: moment().unix()
                        }
                        //Actualizamos el ultimo inicio de sesion
                        db.collection('usuarios').update(
                            { _id: id(queId) },
                            { $set: ultimoInicioSesion },
                            { safe: true, multi: false },
                            (err, result) => {
                                if (err) return next(err);
                                return res.json({
                                    token: token
                                });
                            });
                    }
                    else {
                        res.status(400).json({
                            mensaje: 'Contraseña incorrecta'
                        });
                    }
                });
        }
        else {
            res.status(401).json({
                mensaje: 'El correo no existe'
            });
        }
    });
});


/*COCHES */

app.get('/coches', /*auth,*/  auth, (req, res, next) => {

    const queToken = req.headers.authorization.split(" ")[1];
    fetch(`${CAR_URL}/coches`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json(
                json.elementos
            );
        }
        );
});



app.delete('/coches/:id', auth, (req, res, next) => {
    const queId = req.params.id;
    fetch(`${CAR_URL}/coches/${queId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                borrado: json.resultado
            });
        });
});





app.post('/coches', (req, res, next) => {
    const nuevoElemento = req.body;

    fetch(`${CAR_URL}/coches`, {
        method: 'POST',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                newElement: json.elemento
            });
        });
});

app.put('/coches/:id', (req, res, next) => {

    console.log('ENTRA EN EL BACKEND');
    console.log(req.body);

    const queId = req.params.id;
    const nuevoElemento = {
        nombre: req.body.nombre,
        origen: req.body.origen,
        destino: req.body.destino,
        fechaIda: req.body.fechaIda,
        fechaVuelta: req.body.fechaVuelta,
        precio: req.body.precio,
        client: req.body.client,
        reservado: req.body.reservado
    }
    const token = req.headers.authorization.split(" ")[1];

    fetch(`${CAR_URL}/coches/${queId}`, {
        method: 'PUT',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                actualizado: json.resultado
            });
        });
});


app.get('/cochesReservados/:id',  auth, (req, res, next) => {

    const queId = req.params.id;
    const queToken = req.headers.authorization.split(" ")[1];
    console.log(queId);
    fetch(`${CAR_URL}/cochesUsuario/${queId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            console.log(json);
            res.json(
                json.elementos
            );
        }
        );
});




/*VUELOS*/
app.get('/vuelos', auth, (req, res, next) => {

    const queToken = req.headers.authorization.split(" ")[1];
    fetch(`${FLIGHT_URL}/vuelos`,
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json(
                json.elementos
            );
        }
        );
});



app.delete('/vuelos/:id', (req, res, next) => {
    const queId = req.params.id;
    fetch(`${FLIGHT_URL}/vuelos/${queId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                borrado: json.resultado
            });
        });
});



app.post('/vuelos', (req, res, next) => {
    const nuevoElemento = req.body;

    fetch(`${FLIGHT_URL}/vuelos`, {
        method: 'POST',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                newElement: json.elemento
            });
        });
});

app.put('/vuelos/:id', (req, res, next) => {
    const queId = req.params.id;
    const nuevoElemento = {
        nombre: req.body.nombre,
        origen: req.body.origen,
        destino: req.body.destino,
        fechaIda: req.body.fechaIda,
        fechaVuelta: req.body.fechaVuelta,
        precio: req.body.precio
    }
    fetch(`${FLIGHT_URL}/vuelos/${queId}`, {
        method: 'PUT',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                actualizado: json.resultado
            });
        });
});






/*HOTELES*/
app.get('/hoteles', auth, (req, res, next) => {
    const queToken = req.headers.authorization.split(" ")[1];
    fetch(`${HOTEL_URL}/hoteles`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json(
                json.elementos
            );
        }
        );
});



app.delete('/hoteles/:id', (req, res, next) => {
    const queId = req.params.id;
    fetch(`${HOTEL_URL}/hoteles/${queId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                borrado: json.resultado
            });
        });
});



app.post('/hoteles', (req, res, next) => {
    const nuevoElemento = req.body;

    fetch(`${HOTEL_URL}/hoteles`, {
        method: 'POST',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json'
            //'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                newElement: json.elemento
            });
        });
});

app.put('/hoteles/:id', (req, res, next) => {
    const queId = req.params.id;
    const nuevoElemento = {
        nombre: req.body.nombre,
        origen: req.body.origen,
        destino: req.body.destino,
        fechaIda: req.body.fechaIda,
        fechaVuelta: req.body.fechaVuelta,
        precio: req.body.precio
    }
    fetch(`${HOTEL_URL}/hoteles/${queId}`, {
        method: 'PUT',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(json => {
            //Aqui va la logica de negocio
            res.json({
                result: 'OK',
                actualizado: json.resultado
            });
        });
});

/*
https.createServer(opciones, app).listen(port, () =>{
    console.log(`API REST ejecutandose en http://localhost:${port}`);
});*/



app.listen(port, () => {
    console.log(`API REST ejecutandose en https://localhost:${port}`);
});
