const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        ticket: {
            type: Number,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

noteSchema.pre('save', async function(next) {
    if (this.isNew) {
        let ticketNumber = 500
        let ticketFound = false

        while (!ticketFound) {
            const existingNote = await mongoose.model('Note').findOne({ ticket: ticketNumber })
            if (!existingNote) {
                ticketFound = true
            } else {
                ticketNumber++
            }
        }

        this.ticket = ticketNumber
    }
    next()
})

module.exports = mongoose.model('Note', noteSchema)