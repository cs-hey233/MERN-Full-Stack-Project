const User = require('../models/User')
const Note = require('../models/Note')

// @desc    Get all notes
// @route   GET /notes
// @access  Private

const getAllNotes = async (req, res) => {
    const notes = await Note.find().lean()

    if (!notes?.length) {
        return res.status(404).json({ message: 'No notes found' })
    }

    // Add username to each note
    const notesWithUser = await Promise.all(notes.map(async note => {
        const user = await User.findById(note.user).lean().exec()

        if (!user) {
            return { ...note, username: "Unknown User" }
        }
        
        return { ...note, username: user.username }
        
    }))

    res.json(notesWithUser)
}

// @desc    Create new note
// @route   POST /notes
// @access  Private

const createNewNote = async (req, res) => {
    const { user, title, text } = req.body

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    
    // Confirm user exists
    const userExists = await User.findById(user).lean().exec()
    if (!userExists) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }
    
    // Create amd store the new user
    const note = await Note.create({ user, title, text })
    
    if (note) {
        return res.status(201).json({ message: 'New note created' })
    }
    else {
        return res.status(400).json({message: 'Invalid note data received'})
    }
}

// @desc    Update a note
// @route   PATCH /notes
// @access  Private

const updateNote = async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Update the note
    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({ message: `'${updatedNote.title}' updated` })
}

// @desc    Delete a note
// @route   DELETE /notes
// @access  Private

const deleteNote = async (req, res) => {
    const { id } = req.body
     
    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Delete the note
    await note.deleteOne()

    res.json({ message: `Note with title '${note.title}' and ID '${note._id}' deleted` })
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}