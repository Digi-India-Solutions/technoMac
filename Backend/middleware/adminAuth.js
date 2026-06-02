const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    let token;

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = adminAuth;
