const express = require('express');
const app = express();
const dotenv = require('dotenv')
const MongoDB = require('mongodb')
const jwt = require("jwt-encode");
const bcrypt = require("bcrypt");
const path = require("path")
const sharp = require("sharp");
const multer = require('multer')
const { Transport } = require("./config/lib")

dotenv.config({ path: "./config/config.env" })

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

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

app.post("/signup", multer({ storage }).single("image"), async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body
        if (!username || !email || !password || !confirmPassword)
            return res.status(400).send({ error: "Please fill all required fields" })
        if (password != confirmPassword)
            return res.status(400).send({ error: "Password does not match" })

        const userExist = await Users.findOne({ email })
        if (userExist)
            return res.status(400).send({ error: "User already exists" })

        else {
            const passHash = bcrypt.hashSync(password, 8)
            const verification_code = Math.random().toString().slice(-6)
            const transport = await Transport()
            const mailSend = await transport.sendMail({

                from: process.env.EMAIL_USER,
                to: email,
                subject: "Please verify your email",
                html: `
                <h2>Confirmation code:</h2>
                <h1>${verification_code}<h1/>
                `
            })
            if (mailSend.messageId) {
                if (req?.file?.filename) {
                    const thumbImage = await sharp(req.file.destination + "/" + req.file.originalname)
                        .rotate()
                        .resize({ width: 100, height: 100 })
                        .toFormat("png")
                        .png({ quality: 100 })
                        .toFile(`${req.file.destination + "/" + req.file.originalname.split(".")[0]}_thumb.png`)
                }
                const response = await Users.insertOne({
                    username,
                    email,
                    password: passHash,
                    verification_code,
                    verified: false,
                    image_url: req?.file?.filename ? `images/${req.file.filename}` : "",
                    thumb_image_url: req?.file?.filename ? `images/${req.file.filename.split(".")[0]}_thumb.png` : ""
                })
                if (response.result.ok) {
                    return res.send({ message: "Verfication code has been sent." })
                }
            }
        }

    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
})

app.post("/verify_code", async (req, res) => {
    try {
        const { email, code } = req.body
        if (!email || !code)
            return res.status(400).send({ error: "Invalid data" })

        const user = await Users.findOne({ email })
        if (user.verification_code != code)
            return res.status(400).send({ error: "Invalid code" })

        const updateUser = await Users.updateOne(
            { email },
            {
                $set: {
                    verification_code: "",
                    verified: true
                }
            }
        )
        if (updateUser.result.ok) {
            return res.send({ message: "Account has been verfied" })
        }


    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
})


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).send({ error: "Please fill all required fields" })

        const user = await Users.findOne({ email })
        if (!user)
            return res.status(404).send({ error: "User not found" })
        if (!user.verified)
            return res.status(401).send({ error: "User not verified" })

        const comparePass = bcrypt.compareSync(password, user.password)
        if (!comparePass)
            return res.status(400).send({ error: "Invalid Password" })

        const token = jwt({ email }, process.env.SECRET)
        const updateToken = await Users.updateOne(
            { email },
            { $set: { token } }
        )
        const userObj = { ...user, token }
        delete userObj.password
        delete userObj.verification_code
        return res.status(200).send(userObj)
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
})

app.put("/update_profile", multer({ storage }).single("image"), async (req, res) => {
    try {
        const { username } = req.body
        const { _id, access_token } = req.headers
        if (!_id || !access_token)
            return res.status(400).send({ error: "Invalid headers" })

        const user = await Users.findOne({ _id: MongoDB.ObjectId(_id) })
        if (user.token != access_token)
            return res.status(401).send({ error: "Unauthenticated" })

        if (!username)
            return res.status(400).send({ error: "Please fill all required fields" })

        if (req?.file?.filename) {
            const thumbImage = await sharp(req.file.destination + "/" + req.file.originalname)
                .rotate()
                .resize({ width: 100, height: 100 })
                .toFormat("png")
                .png({ quality: 100 })
                .toFile(`${req.file.destination + "/" + req.file.originalname.split(".")[0]}_thumb.png`)
        }

        const updateUser = await Users.updateOne(
            { _id: MongoDB.ObjectId(_id) },
            {
                $set: {
                    username,
                    image_url: req?.file?.filename ? `images/${req.file.filename}` : user.image_url,
                    thumb_image_url: req?.file?.filename ? `images/${req.file.filename.split(".")[0]}_thumb.png` : user.thumb_image_url
                }
            }
        )
        if (updateUser.result.ok) {
            return res.send({ message: "Profile has been updated" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
})

app.get("/get_profile", async (req, res) => {
    try {
        const { _id, access_token } = req.headers
        if (!_id || !access_token)
            return res.status(400).send({ error: "Invalid headers" })

        const user = await Users.findOne({ _id: MongoDB.ObjectId(_id) })
        if (user.token != access_token)
            return res.status(401).send({ error: "Unauthenticated" })

        const userObj = { ...user }
        delete userObj.password
        delete userObj.verification_code
        return res.send(userObj)
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
})

app.listen(process.env.SERVER_PORT, function () {
    console.log('listening on ' + process.env.SERVER_PORT)
})