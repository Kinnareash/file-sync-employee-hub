import { pool } from '../models/db.js';
import { startOfMonth, endOfMonth } from 'date-fns';

export const getUploadedReport = async (req, res) => {
  const { month, fileType = 'all', department = 'all' } = req.query;

  try {
    const date = new Date(month); // Format: "2025-06"
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const values = [startDate, endDate];
    let index = 3;
    const filters = [
      `(f.created_at BETWEEN $1 AND $2 OR f.created_at IS NULL)`
    ];

    if (fileType !== 'all') {
      filters.push(`(f.category = $${index++} OR f.category IS NULL)`);
      values.push(fileType);
    }

    if (department !== 'all') {
      filters.push(`u.department = $${index++}`);
      values.push(department);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT 
        u.id,
        u.username AS "employeeName",
        u.department,
        f.category AS "fileType",
        f.created_at AS "lastUpload",
        CASE
          WHEN f.created_at IS NULL THEN 'pending'
          WHEN f.created_at BETWEEN $1 AND $2 THEN 'uploaded'
          ELSE 'overdue'
        END AS status,
        CASE 
          WHEN f.created_at < $1 THEN 
            DATE_PART('day', $1::timestamp - f.created_at::timestamp)
          ELSE NULL
        END AS daysOverdue
      FROM users u
      LEFT JOIN files f 
        ON f.user_id = u.id
      ${whereClause}
      ORDER BY u.username;
    `;

    console.log('Generated SQL Query:', query);
    console.log('Query Values:', values);

    const result = await pool.query(query, values);

    console.log('Query success');
    if (result.rows.length > 0) {
      console.log('Sample row:', result.rows[0]);
    } else {
      console.log('No data returned.');
    }

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching Uploaded report:', error);
    res.status(500).json({ message: 'Failed to fetch Uploaded report' });
  }
};
