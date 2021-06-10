const express = require("express");
const router = express.Router()
const multer = require('multer')
const { storage } = require("../config/utils")
const { signup, login, verify_code, update_profile, get_profile } = require("../controllers/Auth")
const AuthMiddleware = require("../middlewares/Auth")

router.post("/signup", multer({ storage }).single("image"), signup)

router.post("/verify_code", verify_code)

router.post("/login", login)

router.put("/update_profile", AuthMiddleware, multer({ storage }).single("image"), update_profile)

router.get("/get_profile", AuthMiddleware, get_profile)

module.exports = router