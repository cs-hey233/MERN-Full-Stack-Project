const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) // null means no error, true means allowing the request
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true, // allows serevr to accept cookies and other credentials from the client
    optionsSuccessStatus: 200 // set the HTTP status code to send on successful OPTIONS request
}

module.exports = corsOptions