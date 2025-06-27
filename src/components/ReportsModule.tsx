import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, Users, TrendingUp, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import CustomCalendar from './ui/CustomCalendar';

interface ReportData {
  employeeName: string;
  department: string;
  fileType: string;
  lastUpload: string;
  status: 'uploaded' | 'pending';
  fileId?: string;
}

const ReportsModule = () => {
  const [calendarMode, setCalendarMode] = useState<'day' | 'month'>('month');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const safeIncludes = (field: string | undefined | null) =>
    field?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

  const fileTypes = ['Tax Forms', 'Performance Review', 'Training Certificate', 'HR Documents', 'Security Scan Report'];
  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales'];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/reports/uploaded', {
          params: {
            month: selectedMonth.toISOString().slice(0, 7),
            fileType: selectedFileType,
            department: selectedDepartment
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setReportData(res.data.data);
      } catch (err) {
        console.error('Error fetching report:', err);
      }
    };
    fetchReports();
  }, [selectedMonth, selectedFileType, selectedDepartment]);

  const filteredData = reportData.filter(r =>
    (safeIncludes(r.employeeName))
  );

  const getStatusStats = () => {
    const total = filteredData.length;
    const uploaded = filteredData.filter(item => item.status === 'uploaded').length;
    const pending = filteredData.filter(item => item.status === 'pending').length;
    return { total, uploaded, pending };
  };

  const stats = getStatusStats();

  const exportReport = () => {
    const csvContent = [
      ['Employee Name', 'Department', 'File Type', 'Last Upload', 'Status', 'File ID'],
      ...filteredData.map(item => [
        item.employeeName,
        item.department,
        item.fileType,
        item.lastUpload,
        item.status,
        item.fileId?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Uploaded-report-${format(selectedMonth, 'yyyy-MM')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: ReportData['status']) => {
    switch (status) {
      case 'uploaded':
        return <Badge className="bg-green-100 text-green-800">Uploaded</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      const { data, headers } = await axios.get(
        `http://localhost:3000/api/files/${fileId}/download`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const cd = headers['content-disposition'] || '';
      const match = cd.match(/filename="?([^\"]+)"?/);
      const filename = match ? decodeURIComponent(match[1]) : `file-${fileId}`;

      const blob = new Blob([data], {
        type: headers['content-type'] || 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Download failed. Please try again.')
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports Module</h1>
        <p className="text-gray-600 mt-2">Monitor upload and generate file submission reports</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Users className="h-5 w-5 text-blue-500" /><div><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-sm text-gray-600">Total Records</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><TrendingUp className="h-5 w-5 text-green-500" /><div><p className="text-2xl font-bold text-green-600">{stats.uploaded}</p><p className="text-sm text-gray-600">Uploaded</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><FileText className="h-5 w-5 text-orange-500" /><div><p className="text-2xl font-bold text-orange-600">{stats.pending}</p><p className="text-sm text-gray-600">pending</p></div></div></CardContent></Card>
      </div>

      {/* Filters and Report Generation */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div><CardTitle>Uploaded Report</CardTitle><CardDescription>Filter and generate upload reports for file submissions</CardDescription></div>
            <Button onClick={exportReport}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-64 justify-start text-left font-normal",
                    !selectedMonth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar
                  selectedDate={selectedMonth}
                  onChange={(date) => setSelectedMonth(date)}
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedFileType} onValueChange={setSelectedFileType}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="File Type" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All File Types</SelectItem>{fileTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent>
            </Select>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employee…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr className="border-b"><th className="text-left p-4 font-medium text-gray-900">Employee</th><th className="text-left p-4 font-medium text-gray-900">Department</th><th className="text-left p-4 font-medium text-gray-900">File Type</th><th className="text-left p-4 font-medium text-gray-900">Last Upload</th><th className="text-left p-4 font-medium text-gray-900">Status</th><th className="text-left p-4 font-medium text-gray-900">Download</th></tr></thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{item.employeeName}</td>
                    <td className="p-4 text-gray-700">{item.department}</td>
                    <td className="p-4 text-gray-700">{item.fileType}</td>
                    <td className="p-4 text-gray-700">{item.lastUpload}</td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4">
                      {item.status === 'uploaded' && item.fileId ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDownload(item.fileId!)}
                          title="Download File"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
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
