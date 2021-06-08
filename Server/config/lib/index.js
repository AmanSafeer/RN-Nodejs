const nodemailer = require("nodemailer");

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

module.exports = {
    Transport
}