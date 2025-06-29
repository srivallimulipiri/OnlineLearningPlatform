// backend/routes/testRoutes.js (Create this file)
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/roleMiddleware');

// Test endpoint for teacher functionality
router.get('/teacher-test', protect, requireTeacher, async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Teacher authentication working!',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
