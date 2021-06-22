var pdf = require("pdf-creator-node");
var fs = require("fs");
var html = fs.readFileSync("./views/report.hbs", "utf8");
const { PdfCreator } = require("../config/utils")

const get_report = async (req, res) => {
    try {
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
                name: "",
                age: "26",
            },
        ]
        const { document, options } = PdfCreator(html, { users })
        const file = await pdf.create(document, options)
        console.log(file);
        return res.send({ report_url: file.filename })
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: err.message })
    }
}

module.exports = {
    get_report
}