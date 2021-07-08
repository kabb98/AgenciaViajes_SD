'use strict'

const express = require('express');


const app = express();

//Middleware
app.use(logger('dev')); //Logger basico
app.use(express.json());    //Convierte a un objeto verdadero JSON
app.use(express.urlencoded({extended : false}));    //Convierte el texto de un formulario a un JSON
app.use(helmet());