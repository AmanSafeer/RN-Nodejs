const MongoDB = require('mongodb')
const { db } = require("../config/db")

const AuthMiddleware = async (req, res, next) => {
    const { _id, access_token } = req.headers
    if (!_id || !access_token)
        return res.status(400).send({ error: "Authenticaion failed, Invalid headers" })

    const user = await db("Users").findOne({ _id: MongoDB.ObjectId(_id) })
    if (user.token != access_token)
        return res.status(401).send({ error: "Unauthenticated" })

    next();
}

module.exports = AuthMiddleware