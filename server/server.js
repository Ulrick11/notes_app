const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'notes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to parse JSON request body
app.use(express.json());
app.use(cors())

// Get all notes
app.get('/api/notes', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notes');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    next(error); // Pass error to the error handling middleware
  }
});

// Add a new note
app.post('/api/notes', async (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    await pool.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
    res.status(201).json({ message: 'Note added successfully' });
  } catch (error) {
    console.error('Error adding note:', error);
    next(error); // Pass error to the error handling middleware
  }
});

// Update a note
app.put('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    await pool.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error updating note:', error);
    next(error); // Pass error to the error handling middleware
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    await pool.query('DELETE FROM notes WHERE id = ?', [id]);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    next(error); // Pass error to the error handling middleware
  }
});

// Error handling middleware
app.use((err, _req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
