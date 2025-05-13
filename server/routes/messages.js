const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:otherUserId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:otherUserId', protect, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    
    // Validate otherUserId
    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID'
      });
    }
    
    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message to another user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    // Validate input
    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a receiver ID and message content'
      });
    }
    
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }
    
    // Create message
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content
    });
    
    // Emit socket event if receiver is online
    if (req.connectedUsers[receiverId]) {
      req.io.to(req.connectedUsers[receiverId]).emit('new-message', message);
    }
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
