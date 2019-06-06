const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const jimp = require('jimp')
const fs = require('fs')

router.post('/create_thumb', checkAuth, (req, res, next) => {
    const thumb_name = process.cwd() + '/temp/thumb'
    const thumb_height = 50
    const thumb_width = 50

    jimp.read(req.query.img_url)
        .then(image => {
            image
                .resize(thumb_height, thumb_width)
                .write(thumb_name, (err) => {
                    if (err) {
                        next(err)
                    } else {
                        res.setHeader('Content-Type', 'image/jpeg')
                        res.sendFile(thumb_name, (err) => {
                            // Delete thumb
                            fs.unlinkSync(thumb_name)
                        })
                    }
                })
        })
        .catch(err => {
            next(err)
        })
})

module.exports = router
