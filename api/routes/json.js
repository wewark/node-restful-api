const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const jsonpatch = require('fast-json-patch')

// Handle POST requests to /json/patch
router.post('/patch', checkAuth, (req, res, next) => {
    let document = JSON.parse(req.body.document)
    const patch = JSON.parse(req.body.patch)
    document = jsonpatch.applyPatch(document, patch).newDocument
    return res.status(200).json({
        success: true,
        document: document
    })
})

module.exports = router
