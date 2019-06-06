const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const userRoutes = require("./api/routes/user")
const imgRoutes = require("./api/routes/img")
const jsonRoutes = require("./api/routes/json")

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))

app.use("/user", userRoutes)
app.use("/img", imgRoutes)
app.use("/json", jsonRoutes)

// Handle wrong links
app.use((req, res, next) => {
    const err = new Error('not found')
    err.status = 404
    next(err)
})

// Return error messages
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: err.message
        }
    })
})

module.exports = app
