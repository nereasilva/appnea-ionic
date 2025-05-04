const User = require('../models/User');

// Protect routes - Simple user ID authentication
exports.protect = async (req, res, next) => {
  let userId;

  console.log('Auth middleware - Request path:', req.path);
  console.log('Auth middleware - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('UserId')
  ) {
    // Get user ID from header
    userId = req.headers.authorization.split(' ')[1];
    console.log('Auth middleware - User ID extracted from header:', userId);
  }

  // Check if user ID exists
  if (!userId) {
    console.log('Auth middleware - No user ID provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Get user from the ID
    const user = await User.findById(userId);

    if (!user) {
      console.log('Auth middleware - User not found for ID:', userId);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Auth middleware - User found:', user.email, 'Role:', user.role);
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware - User lookup error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware - Required roles:', roles);
    console.log('Authorize middleware - User role:', req.user.role);

    if (!req.user.role || !roles.includes(req.user.role)) {
      console.log('Authorize middleware - Access denied: role mismatch');
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    console.log('Authorize middleware - Access granted');
    next();
  };
};
