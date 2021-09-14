const express = require("express");
const router = express.Router()
const { add_message, messages, delete_message } = require("../controllers/Messages")
const AuthMiddleware = require("../middlewares/Auth")

router.post("/add_message", AuthMiddleware, add_message)

router.get("/messages", AuthMiddleware, messages)

router.delete("/delete_message", AuthMiddleware, delete_message)


module.exports = router