// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../models/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  const { username,role, email, password} = req.body;

  const allowedRoles = ['employee', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
    if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields including role are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username,role, email, password) VALUES ($1, $2, $3,$4) RETURNING id, username, email',
      [username,role, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};
