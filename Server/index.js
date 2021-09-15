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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log('listening on ' + port)
})

// var messagebird = require('messagebird')(process.env.MESSAGEBIRD_KEY);

// messagebird.messages.create({
//     originator : 'Aman',
//     recipients : [ '+923463237856' ],
//     body : 'Hi! Aman How are you ?'
// },
// function (err, response) {
//     if (err) {
//     console.log("ERROR:");
//     console.log(err);
// } else {
//     console.log("SUCCESS:");
//     console.log(response);
//         }
// });
