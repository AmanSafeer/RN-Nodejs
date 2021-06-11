const express = require("express");
const router = express.Router()
const { get_report } = require("../controllers/Report")

router.get("/get_report", get_report)


module.exports = router