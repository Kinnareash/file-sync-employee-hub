import { pool } from '../models/db.js';

export const getComplianceReport = async (req, res) => {
  const { month, year, fileType, department } = req.query;

  try {
    const filters = [];
    const values = [];

    let index = 1;

    if (fileType && fileType !== 'all') {
      filters.push(`f.file_type = $${index++}`);
      values.push(fileType);
    }

    if (department && department !== 'all') {
      filters.push(`u.department = $${index++}`);
      values.push(department);
    }

    if (month && year) {
      filters.push(`EXTRACT(MONTH FROM f.upload_date) = $${index++}`);
      values.push(month);
      filters.push(`EXTRACT(YEAR FROM f.upload_date) = $${index++}`);
      values.push(year);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT 
        u.id,
        u.username AS employee_name,
        u.department,
        f.file_type,
        f.upload_date,
        CASE 
          WHEN f.upload_date IS NULL THEN 'missing'
          WHEN f.upload_date < CURRENT_DATE - INTERVAL '30 days' THEN 'overdue'
          ELSE 'compliant'
        END AS status,
        CASE 
          WHEN f.upload_date < CURRENT_DATE - INTERVAL '30 days' THEN 
            DATE_PART('day', CURRENT_DATE - f.upload_date)
          ELSE NULL
        END AS days_overdue
      FROM users u
      LEFT JOIN files f ON f.user_id = u.id
      ${whereClause}
      ORDER BY u.username;
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching compliance report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};
