const MongoDB = require('mongodb')

let Collection= {
    Users: null
}

const connectDB = () => {
    MongoDB.MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmqbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useUnifiedTopology: true
    })
        .then((client) => {
            const AuthDb = client.db("Auth")
            Collection["Users"] = AuthDb.collection("Users")
            console.log('Connected to Database')
        })
        .catch((err) => {
            return console.error(err)
        })
}

const db = (dbname) => {
    return Collection[dbname]
}

module.exports = { 
    connectDB, 
    db
 }
