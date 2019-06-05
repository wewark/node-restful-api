const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.post('/create_thumb', checkAuth, (req, res, next) => {
    console.log('generating thumb');
    // TODO
    return res.status(200).json({
        message: "Auth successful",
    })
})

module.exports = router
