const MongoDB = require('mongodb')
const jwt = require("jwt-encode");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const fs = require("fs")
const { db } = require("../config/db")
const { Transport } = require("../config/utils");

const signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body
        if (!username || !email || !password || !confirmPassword)
            return res.status(400).send({ error: "Please fill all required fields" })
        if (password != confirmPassword)
            return res.status(400).send({ error: "Password does not match" })

        const userExist = await db("Users").findOne({ email })
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
                const response = await db("Users").insertOne({
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
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).send({ error: "Please fill all required fields" })

        const user = await db("Users").findOne({ email })
        if (!user)
            return res.status(404).send({ error: "User not found" })
        if (!user.verified)
            return res.status(401).send({ error: "User not verified" })

        const comparePass = bcrypt.compareSync(password, user.password)
        if (!comparePass)
            return res.status(400).send({ error: "Invalid Password" })

        const token = jwt({ email }, process.env.SECRET)
        const updateToken = await db("Users").updateOne(
            { email },
            { $set: { token } }
        )
        const userObj = { ...user, token }
        delete userObj.password
        return res.status(200).send(userObj)
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

const verify_code = async (req, res) => {
    try {
        const { email, code } = req.body
        if (!email || !code)
            return res.status(400).send({ error: "Invalid data" })

        const user = await db("Users").findOne({ email })
        if (user.verification_code != code)
            return res.status(400).send({ error: "Invalid code" })

        const updateUser = await db("Users").updateOne(
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
}

const update_profile = async (req, res) => {
    try {
        const { username, pre_image } = req.body
        const { _id, access_token } = req.headers
        const user = await db("Users").findOne({ _id: MongoDB.ObjectId(_id) })
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

        const updateUser = await db("Users").updateOne(
            { _id: MongoDB.ObjectId(_id) },
            {
                $set: {
                    username,
                    image_url: req?.file?.filename ? `images/${req.file.filename}` : pre_image ? "" : user.image_url,
                    thumb_image_url: req?.file?.filename ? `images/${req.file.filename.split(".")[0]}_thumb.png` : pre_image ? "" : user.thumb_image_url
                }
            }
        )
        if (updateUser.result.ok) {
            if (pre_image) {
                const img = JSON.parse(pre_image)
                fs.unlink((`./public/images/${img[0]}.${img[1]}`), (err) => { })
                fs.unlink((`./public/images/${img[0]}_thumb.png`), (err) => { })
            }
            return res.send({ message: "Profile has been updated" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

const get_profile = async (req, res) => {
    try {
        const { _id, access_token } = req.headers
        const user = await db("Users").findOne({ _id: MongoDB.ObjectId(_id) })
        if (user.token != access_token)
            return res.status(401).send({ error: "Unauthenticated" })

        const userObj = { ...user }
        delete userObj.password
        return res.send(userObj)
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}



module.exports = {
    signup,
    login,
    verify_code,
    update_profile,
    get_profile
}