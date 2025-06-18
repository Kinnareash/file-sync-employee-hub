
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { FileUp, Users, BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Files Uploaded',
      value: '12',
      description: 'This month',
      icon: FileUp,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Reviews',
      value: '3',
      description: 'Awaiting approval',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Approved Files',
      value: '9',
      description: 'Successfully processed',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Overdue',
      value: '2',
      description: 'Requires attention',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  const adminStats = [
    {
      title: 'Total Employees',
      value: '48',
      description: 'Active users',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Monthly Reports',
      value: '15',
      description: 'Generated this month',
      icon: BarChart3,
      color: 'text-indigo-600'
    }
  ];

  const displayStats = user?.role === 'admin' ? [...stats, ...adminStats] : stats;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest file uploads and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Uploaded', file: 'Employee_Contract_2024.pdf', time: '2 hours ago', status: 'approved' },
                { action: 'Updated', file: 'Tax_Documents.pdf', time: '1 day ago', status: 'pending' },
                { action: 'Uploaded', file: 'Performance_Review.docx', time: '3 days ago', status: 'approved' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action} {activity.file}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Categories</CardTitle>
            <CardDescription>Overview of your document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'HR Documents', count: 8, color: 'bg-blue-500' },
                { category: 'Tax Forms', count: 3, color: 'bg-green-500' },
                { category: 'Contracts', count: 5, color: 'bg-purple-500' },
                { category: 'Reports', count: 2, color: 'bg-orange-500' }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${category.color}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {category.category}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {category.count} files
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
