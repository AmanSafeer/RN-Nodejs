const express = require('express');
const app = express();
const dotenv = require('dotenv')
const path = require("path")
const { connectDB } = require("./config/db")

dotenv.config({ path: "./config/config.env" })
connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

const AuthRoute = require("./routes/Auth")
const ReportRoute = require("./routes/Report")
const MessagesRoute = require("./routes/Messages")

app.use("/", AuthRoute)
app.use("/", ReportRoute)
app.use("/", MessagesRoute)

app.listen(process.env.SERVER_PORT, function () {
    console.log('listening on ' + process.env.SERVER_PORT)
})