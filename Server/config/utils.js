const nodemailer = require("nodemailer");
const multer = require('multer');

const Transport = async () => {
    try {
        let transport = await nodemailer.createTransport(
            {
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                    // type: "OAuth2",
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const PdfCreator = (html) => {
    const options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Report</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                // first: 'Cover page',
                1: "First page", // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    }

    var users = [
        {
            name: "Shyam",
            age: "26",
        },
        {
            name: "Navjot",
            age: "26",
        },
        {
            name: "Vitthal",
            age: "26",
        },
    ]

    const document = {
        html,
        data: users,
        path: "./public/reports/report.pdf",
    }

    return { document, options }
}

module.exports = {
    Transport,
    storage,
    PdfCreator
}