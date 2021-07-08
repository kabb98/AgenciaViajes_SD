'use strict'
const bcrypt = require('bcrypt');

//Devuelve un Hash con Salt incluido en el formato
function encryptPassword(password)
{
    return bcrypt.hash(password, 10);
}

//Funcion que compara la contraseña con el hash generado
function comparePassword(password, hash)
{
    return bcrypt.compare(password, hash);
}

//Para importar las funciones
module.exports = {
    encryptPassword,
    comparePassword
};