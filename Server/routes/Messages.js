const express = require("express");
const router = express.Router()
const { add_message, messages } = require("../controllers/Messages")
const AuthMiddleware = require("../middlewares/Auth")

router.post("/add_message", AuthMiddleware, add_message)

router.get("/messages", AuthMiddleware, messages)


module.exports = router