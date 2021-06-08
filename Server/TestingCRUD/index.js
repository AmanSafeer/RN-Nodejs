
// let testAccount;
// nodemailer.createTestAccount()
//     .then((account) => {
//         testAccount = account
//         console.log("user", testAccount.user)
//         console.log("pass", testAccount.pass)
//         // host: "smtp.ethereal.email", host for testing account
//     })


// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmqbj.mongodb.net/Auth?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then((Auth) => {
//         const AuthSchema = Auth.Schema
//         const UsersSchema = new AuthSchema({
//             email: {
//                 type: String,
//                 required: true
//             },
//             username: {
//                 type: String,
//                 required: true
//             },
//             password: {
//                 type: String,
//                 required: true
//             },
//             confirmPassword:{
//                 type: String,
//                 required: true
//             }

//         })
//         Users = mongoose.model('Users', UsersSchema);
//         console.log('Connected to Database')
//     })
//     .catch((err) => {
//         return console.error(err)
//     })

let messagesCollection;
MongoDB.MongoClient.connect(connectionString, {
    useUnifiedTopology: true
})
    .then((client) => {
        const  UsersDb = client.db("Users")
        messagesCollection = UsersDb.collection("Messages")
        console.log('Connected to Database')
    })
    .catch((err) => {
        return console.error(err)
    })

app.post('/send_messages', (req, res) => {
    console.log("post request", req.body)
    // res.status(400).send({ error: { message: "Invalid data" } });
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

app.get('/get_filtered_messages', (req, res) => {
    console.log("data", req.query)
    messagesCollection.find({ name: req.query.name }).toArray()
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

app.put("/update_multi_messages", (req, res) => {
    console.log("multi put request", req.body)
    messagesCollection.updateMany(
        { message: "Hello" },
        {
            $set: {
                type: req.body.type
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
