const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET, // <-- yahan change karo
    );

    req.admin = decoded;

    next();
  } catch (error) {
    console.log('JWT ERROR =>', error.message);

    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = adminAuth;
