const MongoDB = require('mongodb')
const { db } = require("../config/db")

const add_message = async (req, res) => {
    try {
        const { message } = req.body
        const { _id } = req.headers
        if (!message)
            return res.status(400).send({ message: "Please enter message" })
            
        const user = await db("Users").findOne({ _id: MongoDB.ObjectId(_id) })
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
        const response = await db("Messages").find().toArray()
        if (response) {
            return res.send({ messages: response })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

const delete_message = async (req, res) => {
    try {
        const { message_id } = req.query
        console.log({ message_id })
        const response = await db("Messages").deleteOne({ _id: MongoDB.ObjectId(message_id) })
        if (response.result.ok) {
            return res.send({ message: "Message has been deleted" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

module.exports = {
    add_message,
    messages,
    delete_message
}