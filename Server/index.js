const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb+srv://testingUser:Testing12345@cluster0.rmqbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

let dbcollection;

MongoClient.connect(connectionString, {
    useUnifiedTopology: true
})
    .then((client) => {
        console.log('Connected to Database')
        const db = client.db("Users")
        dbcollection = db.collection("Messages")
    })
    .catch((err) => {
       return console.error(err)
    })

app.use(bodyParser.urlencoded({ extended: true }))


app.post('/', (req, res) => {
    console.log("request", req.body)
    // dbcollection.insertOne(req.body)
    // .then(result => {
    //     // res.redirect('/')
    //     console.log(result)
    //     return result
    // })
    // .catch(error => {
    //     console.log(error)
    //     return error
    // })
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

app.listen(3000, function () {
    console.log('listening on 3000')
})