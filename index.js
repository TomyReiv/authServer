const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');
require('dotenv').config();


//crear el servidor/aplicacion de express

const app = express();

//base de datos

dbConnection();

//Directorio publico

app.use(express.static('public'));

//Cors
app.use(cors());

//Lectura y parseo del body

app.use(express.json());

//Rutes
app.use('/api/auth', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})

//Manejar rutas (seria si no se usa el hash en angular)
/* app.get('*', (res, req) =>{
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
}) */
