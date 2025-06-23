import {pool} from '../models/db.js'; // your PostgreSQL connection (using pg or pg-promise)

export const getAllEmployees = async (req, res) => {
  console.log("getAllEmployees called by:", req.user);
  try {
    const result = await pool.query('SELECT id, username, email, role, status, department, join_date FROM users'); 
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update status (active/inactive)
export const updateEmployeeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
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
  const { username, email, department, role, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET username = $1, email = $2, department = $3, role = $4, status = $5 
       WHERE id = $6 
       RETURNING *`,
      [username, email, department, role, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Error updating employee', error: err.message });
  }
};
