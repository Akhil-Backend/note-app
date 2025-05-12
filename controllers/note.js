const Note = require('../models/Note');

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const filter = {
      isDeleted: false,
      userId: req.user.userId
    };

    // Get total count for pagination
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      notes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      isDeleted: false,
      userId: req.user.userId
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, body } = req.body;
    const note = new Note({
      title,
      body,
      userId: req.user.userId,
      isDeleted: false
    });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, body } = req.body;
    const note = await Note.findOne({ 
      _id: req.params.id,
      isDeleted: false,
      userId: req.user.userId
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title || note.title;
    note.body = body || note.body;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note (soft delete)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      isDeleted: false,
      userId: req.user.userId
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isDeleted = true;
    await note.save();
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 