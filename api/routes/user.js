const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/login', (req, res, next) => {
    const token = jwt.sign({
        username: req.body.username
    },
    process.env.JWT_KEY,
    {
        expiresIn: "1h"
    })

    return res.status(200).json({
        message: "Auth successful",
        token: token
    })
})

module.exports = router
