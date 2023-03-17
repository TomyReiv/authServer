const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async (req, res = response) => {

    const { email, name, password } = req.body;

    try {
        //Verificar correo unico
        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese mail'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario(req.body);

        //hashear la contraseña
        const salt = bcrypt.genSaltSync(10);
        dbUser.password = bcrypt.hashSync(password, salt);

        //generar el jsonwebtoken
        const token = await generarJWT(dbUser.id, name);

        //Crear usuario en bd
        await dbUser.save();

        //generar respuesta
        return res.status(201).json({
            ok: true,
            id: dbUser.id,
            name,
            email,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const dbUser = await Usuario.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar si el pass hace match

        const validPass = bcrypt.compareSync(password, dbUser.password);
        if (!validPass) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        //si son validos
        //generar el jsonwebtoken
        const token = await generarJWT(dbUser.id, dbUser.name);

        //respuesta
        return res.json({
            ok: true,
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async (req, res = response) => {

   const {id} = req;

    //leer la base de datos
    const dbUser = await Usuario.findById(id);



   const token = await generarJWT(id, dbUser.name);


    return res.json({
        ok: true,
        id,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}