import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  FileUp, Users, BarChart3, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';


const Dashboard = () => {
  const { user, token } = useAuthStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/dashboard/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Dashboard response:', res.data);

        setData({
          ...res.data,
          recentActivity: res.data.recentActivity ?? [],
          categories: res.data.categories ?? [],
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard…</p>;
  }

  if (!data) {
    return <p className="text-red-600">Unable to load dashboard.</p>;
  }


  const stats = [
    { title: 'Files Uploaded', value: data.filesUploaded, description: 'This month', icon: FileUp, color: 'text-blue-600' },
    // { title: 'Pending Reviews', value: data.pendingReviews, description: 'Awaiting approval', icon: Clock, color: 'text-yellow-600' },
    // { title: 'Approved Files', value: data.approvedFiles, description: 'Successfully processed', icon: CheckCircle, color: 'text-green-600' },
    // { title: 'Overdue', value: data.overdue, description: 'Requires attention', icon: AlertTriangle, color: 'text-red-600' },
  ];

  const adminStats = [
    { title: 'Total Employees', value: data.totalEmployees, description: 'Active users', icon: Users, color: 'text-purple-600' },
    { title: 'Monthly Reports', value: data.monthlyReports, description: 'Generated this month', icon: BarChart3, color: 'text-indigo-600' },
  ];

  const displayStats = user?.role === 'admin'
    ? [...stats, ...adminStats]
    : stats;

  const palette = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your file management system
        </p>
      </div>

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map(({ title, value, description, icon: Icon, color }, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ACTIVITY */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest file uploads and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity found.</p>
              ) : (
                data.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${a.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {a.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {/* {new Date(a.created_at).toLocaleString()} */}
                           {a.created_at ? new Date(a.created_at).toLocaleString() : 'No date'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>


        {/* FILE CATEGORIES */}
        <Card>
          <CardHeader>
            <CardTitle>File Categories</CardTitle>
            <CardDescription>Overview of your document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categories.length === 0 ? (
                <p className="text-sm text-gray-500">No file categories available.</p>
              ) : (
                data.categories.map((c, idx) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${palette[idx % palette.length]}`} />
                      <span className="text-sm font-medium text-gray-700">{c.category}</span>
                    </div>
                    <span className="text-sm text-gray-500">{c.count} files</span>
                  </div>
                ))
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div >
  );
};

export default Dashboard;
