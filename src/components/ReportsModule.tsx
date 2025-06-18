
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportData {
  id: string;
  employeeName: string;
  department: string;
  fileType: string;
  lastUpload: string;
  status: 'compliant' | 'overdue' | 'missing';
  daysOverdue?: number;
}

const ReportsModule = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Mock data - this will be replaced with actual data from database
  const reportData: ReportData[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      department: 'Engineering',
      fileType: 'Tax Forms',
      lastUpload: '2024-01-15',
      status: 'overdue',
      daysOverdue: 45
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      department: 'HR',
      fileType: 'Performance Review',
      lastUpload: '2024-02-20',
      status: 'compliant'
    },
    {
      id: '3',
      employeeName: 'Mike Wilson',
      department: 'Finance',
      fileType: 'Tax Forms',
      lastUpload: '2023-12-01',
      status: 'overdue',
      daysOverdue: 78
    },
    {
      id: '4',
      employeeName: 'Sarah Davis',
      department: 'Marketing',
      fileType: 'Training Certificate',
      lastUpload: 'Never',
      status: 'missing'
    }
  ];

  const fileTypes = ['Tax Forms', 'Performance Review', 'Training Certificate', 'HR Documents', 'Contracts'];
  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales'];

  const filteredData = reportData.filter(item => {
    const matchesFileType = selectedFileType === 'all' || item.fileType === selectedFileType;
    const matchesDepartment = selectedDepartment === 'all' || item.department === selectedDepartment;
    return matchesFileType && matchesDepartment;
  });

  const getStatusStats = () => {
    const total = filteredData.length;
    const compliant = filteredData.filter(item => item.status === 'compliant').length;
    const overdue = filteredData.filter(item => item.status === 'overdue').length;
    const missing = filteredData.filter(item => item.status === 'missing').length;
    
    return { total, compliant, overdue, missing };
  };

  const stats = getStatusStats();

  const exportReport = () => {
    const csvContent = [
      ['Employee Name', 'Department', 'File Type', 'Last Upload', 'Status', 'Days Overdue'],
      ...filteredData.map(item => [
        item.employeeName,
        item.department,
        item.fileType,
        item.lastUpload,
        item.status,
        item.daysOverdue?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${format(selectedMonth, 'yyyy-MM')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: ReportData['status']) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'missing':
        return <Badge className="bg-orange-100 text-orange-800">Missing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports Module</h1>
        <p className="text-gray-600 mt-2">
          Monitor compliance and generate file submission reports
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                <p className="text-sm text-gray-600">Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.missing}</p>
                <p className="text-sm text-gray-600">Missing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Report Generation */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Compliance Report</CardTitle>
              <CardDescription>
                Filter and generate compliance reports for file submissions
              </CardDescription>
            </div>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-64 justify-start text-left font-normal",
                    !selectedMonth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => {
                    setSelectedMonth(date || new Date());
                    setDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedFileType} onValueChange={setSelectedFileType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All File Types</SelectItem>
                {fileTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Employee</th>
                  <th className="text-left p-4 font-medium text-gray-900">Department</th>
                  <th className="text-left p-4 font-medium text-gray-900">File Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Last Upload</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{item.employeeName}</td>
                    <td className="p-4 text-gray-700">{item.department}</td>
                    <td className="p-4 text-gray-700">{item.fileType}</td>
                    <td className="p-4 text-gray-700">{item.lastUpload}</td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4 text-gray-700">
                      {item.daysOverdue ? `${item.daysOverdue} days` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>No records found for the selected filters</p>
              <p className="text-sm">Try adjusting your filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsModule;
