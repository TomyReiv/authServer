const JWT = require('jsonwebtoken');

const generarJWT = (id, name) => {
    const payload = { id, name };

    return new Promise((resolve, reject) => {

        JWT.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(token)
            }
        })

    })

}

module.exports={
    generarJWT
}

