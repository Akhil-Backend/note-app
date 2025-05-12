const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note');
const auth = require('../middleware/auth');

// All note routes are protected
router.get('/', auth, noteController.getAllNotes);
router.get('/:id', auth, noteController.getNote);
router.post('/', auth, noteController.createNote);
router.put('/:id', auth, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router; 