const express = require('express');
const router = express.Router();

// Empty routes file - will be populated
router.get('/', (req, res) => {
  res.json({ message: 'Reviews routes placeholder' });
});

module.exports = router;
