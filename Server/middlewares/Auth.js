
const AuthMiddleware = (req, res, next) => {
        const { _id, access_token } = req.headers
        if (!_id || !access_token)
            return res.status(400).send({ error: "Authenticaion failed, Invalid headers" })
    next();
}

module.exports = AuthMiddleware