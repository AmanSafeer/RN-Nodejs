var pdf = require("pdf-creator-node");
var fs = require("fs");
var html = fs.readFileSync("./views/report.html", "utf8");
const { document, options } = require("../config/utils").PdfCreator(html)


const get_report = async (req, res) => {
    try {
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