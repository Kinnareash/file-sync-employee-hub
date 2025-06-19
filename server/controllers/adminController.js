import {pool} from '../models/db.js'; // your PostgreSQL connection (using pg or pg-promise)

export const getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users'); 
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
