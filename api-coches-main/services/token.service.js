'use strict'

const SECRET = require('../config/config').SECRET;
const EXP_TIME = require('../config/config').TIME_EXP;

const jwt = require('jwt-simple');
const moment = require('moment');

//Crear token
//Devuelve un token con formato JWT
function crearToken(user)
{
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(EXP_TIME, 'minutes').unix()
    }

    return jwt.encode(payload, SECRET);
}


function decodificaToken(token)
{
    return new Promise( (resolve, reject) => {
        try {
            const payload = jwt.decode(token, SECRET, true);
            //Si es menor ha caducado
            if(payload.exp <= moment().unix())
            {
                reject({
                    status: 401,
                    message: 'El token ha expirado'
                });
            }
            resolve(payload.sub);
        } catch (err) {
            reject({
                status: 500,
                message: 'El token es valido',
                error: err
            });
        }
    });
}




//Importamos las funciones
module.exports =
{
    crearToken,
    decodificaToken
}
