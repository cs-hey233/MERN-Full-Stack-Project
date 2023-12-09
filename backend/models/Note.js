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
        const lastNote = await mongoose.model('Note').findOne().sort({ createdAt: -1 })
        this.ticket = lastNote && lastNote.ticket ? lastNote.ticket + 1 : 500
    }
    next()
})

module.exports = mongoose.model('Note', noteSchema)