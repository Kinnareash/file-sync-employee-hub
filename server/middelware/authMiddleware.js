// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (allowedRoles = []) => {  // Accept allowed roles as parameter
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      
      // Role check (if allowedRoles is provided)
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.user = user;
      next();
    });
  };
};

export default verifyToken;