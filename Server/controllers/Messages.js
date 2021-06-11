const MongoDB = require('mongodb')
const { db } = require("../config/db")

const add_message = async (req, res) => {
    try {
        const { message } = req.body
        const { _id, access_token } = req.headers
        const user = await db("Users").findOne({ _id: MongoDB.ObjectId(_id) })
        if (user.token != access_token)
            return res.status(401).send({ error: "Unauthenticated" })
        if (!message)
            return res.status(400).send({ message: "Please enter message" })

        const response = await db("Messages").insertOne({
            user: user.email,
            message,
        })
        if (response.result.ok) {
            return res.send({ message: "Message has been added" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

const messages = async (req, res) => {
    try {
        const { _id, access_token } = req.headers
        const user = await db("Users").findOne({ _id: MongoDB.ObjectId(_id) })
        if (user.token != access_token)
            return res.status(401).send({ error: "Unauthenticated" })
        const response = await  db("Messages").find().toArray()
        if (response) {
            return res.send({ messages: response })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

module.exports = {
    add_message,
    messages
}