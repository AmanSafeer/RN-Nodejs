const express = require('express');
const app = express();
const MongoDB = require('mongodb')
const connectionString = "mongodb+srv://testingUser:Testing12345@cluster0.rmqbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

let messagesDb, messagesCollection;

MongoDB.MongoClient.connect(connectionString, {
    useUnifiedTopology: true
})
    .then((client) => {
        messagesDb = client.db("Users")
        messagesCollection = messagesDb.collection("Messages")
        console.log('Connected to Database')
    })
    .catch((err) => {
        return console.error(err)
    })

app.post('/send_messages', (req, res) => {
    console.log("post request", req.body)
    messagesCollection.insertOne(req.body)
        .then(result => {
            console.log(result)
            res.send({ message: "Message has been added" })
        })
        .catch(error => {
            console.log(error)
            return error
        })
})

app.post('/send_multi_messages', (req, res) => {
    console.log("multi post request", req.body)
    messagesCollection.insertMany(req.body)
        .then(result => {
            console.log(result)
            res.send({ message: "Message has been added" })
        })
        .catch(error => {
            console.log(error)
            return error
        })
})

app.get('/get_messages', (req, res) => {
    messagesCollection.find().toArray()
        .then(result => {
            console.log("Messages", result)
            res.send(result)
        })
        .catch(error => {
            console.log(error)
            return error
        })
})

app.put("/update_messages", (req, res) => {
    console.log("put request", req.body)
    messagesCollection.updateOne(
        { _id: MongoDB.ObjectId(req.body._id) },
        {
            $set: {
                name: req.body.name,
                message: req.body.message
            }
        }
    )
        .then(result => {
            console.log(console.log("Messages", result))
            res.send({ message: "Messages has been updated" })
        })
        .catch(error => {
            console.log("error", error)
            return error
        })
})

app.delete("/delete_messages", (req, res) => {
    console.log("delete request", req.body)
    // res.status(400).send({message:"Invalid data"})
    messagesCollection.deleteOne(
        { _id: MongoDB.ObjectId(req.body._id) }
    )
        .then(result => {
            console.log(console.log("Messages", result))
            res.send({ message: "Messages has been deleted" })
        })
        .catch(error => {
            console.log("error", error)
            return error
        })
})

app.delete("/delete_multi_messages", (req, res) => {
    console.log("multi delete request", req.body)
    let idArr = req.body.map(val => MongoDB.ObjectId(val._id))
    messagesCollection.deleteMany({ _id: { $in: idArr } })
        .then(result => {
            console.log(console.log("Messages", result))
            res.send({ message: "Messages has been deleted" })
        })
        .catch(error => {
            console.log("error", error)
            return error
        })
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

app.listen(3000, function () {
    console.log('listening on 3000')
})