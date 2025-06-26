import { pool } from '../models/db.js';

export const getDashboardSummary = async (req, res) => {
  try {
    console.log('Building dashboard summary');
    console.log('user.id:', req.user.id, '| role:', req.user.role);

    const isAdmin = req.user.role === 'admin';
    const userParam = isAdmin ? [] : [req.user.id];
    const userFilter = isAdmin ? '' : 'AND f.user_id = $1';

    const [
      filesUploaded,
      // overdueFiles,
      totalEmployees,
      monthlyReports,
      recentActivity,
      categories
    ] = await Promise.all([

      // Files uploaded this month
      pool.query(`
        SELECT COUNT(*) AS c
          FROM files f
         WHERE TRUE ${userFilter}
           AND f.created_at >= date_trunc('month', CURRENT_DATE)
      `, userParam),

      // Overdue files
      // pool.query(`
      //   SELECT COUNT(*) AS c
      //     FROM files f
      //    WHERE TRUE ${userFilter}
      //      AND f.status = 'pending'
      //      AND f.due_at IS NOT NULL
      //      AND f.due_at < NOW()
      // `, userParam),

      // Active users
      pool.query(`
        SELECT COUNT(*) AS c
          FROM users
         WHERE user_status = 'active'
      `),

      // Reports this month
      pool.query(`
        SELECT COUNT(*) AS c
          FROM reports
         WHERE generated_at >= date_trunc('month', CURRENT_DATE)
      `).catch(() => ({ rows: [{ c: 0 }] })),

      // Recent file activity
      pool.query(`
        SELECT filename, status, created_at
          FROM files f
         WHERE TRUE ${userFilter}
         ORDER BY created_at DESC
         LIMIT 5
      `, userParam),

      // File categories
      pool.query(`
        SELECT category, COUNT(*) AS count
          FROM files f
         WHERE TRUE ${userFilter}
         GROUP BY category
         ORDER BY count DESC
      `, userParam)
    ]);

    const summary = {
      filesUploaded : +filesUploaded.rows[0].c,
      // overdue       : +overdueFiles.rows[0].c,
      totalEmployees: +totalEmployees.rows[0].c,
      monthlyReports: +monthlyReports.rows[0].c,
      recentActivity: recentActivity.rows,
      categories    : categories.rows
    };

    console.log('Dashboard Summary:', summary);
    res.json(summary);
  } catch (err) {
    console.error('Error in getDashboardSummary:', err);
    res.status(500).json({ message: 'Problem building dashboard summary' });
  }
};
