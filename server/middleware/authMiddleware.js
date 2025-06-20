import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Expect: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      // Optional: role-based access check
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }; // Attaching user info to request
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message); // 👈 ADD THIS
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
};

export default verifyToken;
