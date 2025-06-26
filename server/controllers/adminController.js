import { pool } from '../models/db.js';

export const getAllEmployees = async (req, res) => {
  console.log("getAllEmployees called by:", req.user);
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        username, 
        email, 
        role,
        COALESCE(user_status, 'inactive') AS user_status, 
        user_status, 
        department, 
        join_date 
      FROM users
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update status (active/inactive)
export const updateEmployeeStatus = async (req, res) => {
  const { id } = req.params;
  const { user_status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET user_status = $1 
       WHERE id = $2 
       RETURNING id, username, email, role, user_status, department`, 
      [user_status, id]  
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Status update failed:', err);
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// Update full profile info
export const updateEmployeeInfo = async (req, res) => {
  const { id } = req.params;
  const { username, email, department, role, user_status } = req.body;  

  try {
    const result = await pool.query(
      `UPDATE users 
       SET 
         username = $1, 
         email = $2, 
         department = $3, 
         role = $4, 
         user_status = $5  
       WHERE id = $6 
       RETURNING id, username, email, role, user_status, department`,  
      [username, email, department, role, user_status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Error updating employee', error: err.message });
  }
};