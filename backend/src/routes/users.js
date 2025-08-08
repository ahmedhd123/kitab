const express = require('express');
const router = express.Router();

// Empty routes file - will be populated
router.get('/', (req, res) => {
  res.json({ message: 'Users routes placeholder' });
});

module.exports = router;
