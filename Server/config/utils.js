const nodemailer = require("nodemailer");
const multer = require('multer');

const Transport = async () => {
    try {
        let transport = await nodemailer.createTransport(
            {
                // service: "Gmail",
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                    // type: "OAuth2",
                    // clientId: process.env.CLIENTID,
                    // clientSecret: process.env.CLIENTSECRET,
                    // refreshToken: process.env.REFRESHTOKEN,
                    // accessToken: process.env.ACCESSTOKEN
                },
                tls: {
                    rejectUnauthorized: false
                }
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

const PdfCreator = (html, data) => {
    const options = {
        format: "A4",
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
    const document = {
        html,
        data,
        path: "./public/reports/report.pdf",
    }

    return { document, options }
}

module.exports = {
    Transport,
    storage,
    PdfCreator
}