const express = require('express');
const app = express();
const MongoDB = require('mongodb')
const jwt = require("jwt-encode");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path")
const multer = require('multer')
const PORT = 3000

const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

let Users;
MongoDB.MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmqbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useUnifiedTopology: true
})
    .then((client) => {
        const AuthDb = client.db("Auth")
        Users = AuthDb.collection("Users")
        console.log('Connected to Database')
    })
    .catch((err) => {
        return console.error(err)
    })

// let AuthDB
// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmqbj.mongodb.net/Auth?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
// })
// console.log('Connected to Database')
//     .then((Auth) => {
//         AuthDB = Auth
//     })
//     .catch((err) => {
//         return console.error(err)
//     })

// const AuthSchema = AuthDB.Schema
// const UsersSchema = new AuthSchema({})
// const Users = mongoose.model('Users', UsersSchema);


let testAccount;
nodemailer.createTestAccount()
    .then((account) => {
        testAccount = account
        console.log("user", testAccount.user)
        console.log("pass", testAccount.pass)
    })

const Transport = async () => {
    try {
        let transport = await nodemailer.createTransport(
            {
                host: "smtp.ethereal.email",
                // host: 'smtp.gmail.com',
                // service: "Gmail",
                auth: {
                    type: "login",
                    user: testAccount.user,
                    pass: testAccount.pass,
                    // type: "OAuth2",
                    // user: process.env.USER,
                    // pass: process.env.PASS,
                    // clientId: process.env.CLIENTID,
                    // clientSecret: process.env.CLIENTSECRET,
                    // refreshToken: process.env.REFRESHTOKEN,
                    // accessToken: process.env.ACCESSTOKEN
                },
            }
        )
        return transport
    }
    catch (err) {
        console.log("transport err", err)
    }

}

const upload = multer({ dest: './public/images' })
app.post("/signup", upload.single("image"), async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        if (name && email && password && confirmPassword) {
            if (password == confirmPassword) {
                if (req.file.filename) {
                    console.log(`http://localhost:3000/images/${req.file.filename}`)
                }
                const userExist = await Users.findOne({ email })
                if (userExist) {
                    return res.status(400).send({ error: "User already exists" })
                }
                else {
                    const passHash = bcrypt.hashSync(password, 8)
                    const verification_code = Math.random().toString().slice(-6)
                    const transport = await Transport()
                    const mailSent = await transport.sendMail({
                        from: testAccount.user,
                        to: email,
                        subject: "Please verify your email",
                        html: `
                            <h2>Confirmation code:</h2>
                            <h1>${verification_code}<h1/>
                            `
                    })
                    if (mailSent.messageId) {
                        const response = await Users.insertOne({
                            username: name,
                            email,
                            password: passHash,
                            verification_code,
                            verified: false
                        })
                        console.log("response", response.result.ok)
                        if (response.result.ok) {
                            res.send({
                                message: "Verfication code has been sent."
                            })
                        }
                    }
                }
            }
            else {
                return res.status(400).send({ error: "Password does not match" })
            }
        }
        else {
            return res.status(400).send({ error: "Please fill all required fields" })
        }
    }
    catch (err) {
        return res.status(400).send({ error: err.message })
    }
})

app.post("/verify_code", async (req, res) => {
    try {
        const { email, code } = req.body
        if (email && code) {
            const user = await Users.findOne({ email })
            if (user.verification_code == code) {
                const updateUser = await Users.updateOne(
                    { email },
                    {
                        $set: {
                            verification_code: "",
                            verified: true
                        }
                    }
                )
                console.log("update", updateUser.result.ok)
                if (updateUser.result.ok) {
                    res.send({
                        message: "Account has been verfied"
                    })
                }

            }
            else {
                return res.status(400).send({ error: "Invalid code" })
            }
        }
        else {
            return res.status(400).send({ error: "Invalid data" })
        }
    }
    catch (err) {
        return res.status(400).send({ error: err.message })
    }
})


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const user = await Users.findOne({ email })
            if (user) {
                if (user.verified) {
                    const comparePass = bcrypt.compareSync(password, user.password)
                    if (comparePass) {
                        const token = jwt({ email }, process.env.SECRET)
                        const updateToken = await Users.updateOne(
                            { email },
                            { $set: { token } }
                        )
                        console.log("updatetoken", updateToken.result)
                        res.status(200).send({
                            email: user.email,
                            username: user.username,
                            _id: user._id,
                            token
                        })
                    }
                    else {
                        return res.status(400).send({ error: "Invalid Password" })
                    }
                }
                else {
                    return res.status(401).send({ error: "User not verified" })
                }
            }
            else {
                return res.status(404).send({ error: "User not found" })
            }
        }
        else {
            return res.status(400).send({ error: "Please fill all required fields" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
})

app.post("/update_profile", async (req, res) => {
    try {
        const { username } = req.body
        const { _id, access_token } = req.headers
        if (_id && access_token) {
            const user = await Users.findOne({ _id: MongoDB.ObjectId(_id) })
            if (user.token == access_token) {
                const updateUser = await Users.updateOne(
                    { _id: MongoDB.ObjectId(_id) },
                    { $set: { username } }
                )
                if (updateUser.result.ok) {
                    res.send({ message: "Profile has been updated" })
                }
            }
            else {
                return res.status(401).send({ error: "Unauthenticated" })
            }
        }
        else {
            return res.status(400).send({ error: "Invalid headers" })
        }
    }
    catch (err) {
        return res.status(400).send({ error: err.message })
    }
})

app.get("/get_profile", async (req, res) => {
    try {
        const { _id, access_token } = req.headers
        if (_id && access_token) {
            const user = await Users.findOne({ _id: MongoDB.ObjectId(_id) })
            if (user.token == access_token) {
                res.send({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                })
            }
            else {
                return res.status(401).send({ error: "Unauthenticated" })
            }
        }
        else {
            return res.status(400).send({ error: "Invalid headers" })
        }
    }
    catch (err) {
        return res.status(400).send({ error: err.message })
    }
})

app.listen(PORT, function () {
    console.log('listening on ' + PORT)
})