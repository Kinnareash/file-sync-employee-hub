import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Edit2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect } from 'react';
import axios from 'axios';

interface Employee {
  id: string;
  username: string;
  email: string;
  role: 'employee' | 'admin';
  user_status:  'active' | 'inactive';
  department: string;
  joinDate: string;
}

const AdminModule = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token); 

        const res = await axios.get('http://localhost:3000/api/admin/employees', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        toast({
          title: 'Error',
          description: 'Unable to fetch employees.',
          variant: 'destructive'
        });
      }
    };

    fetchEmployees();
  }, []);


  const safeIncludes = (value: string | null | undefined) =>
    value?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

  const filteredEmployees = employees.filter(employee => {
    return (
      safeIncludes(employee.username) ||
      safeIncludes(employee.email) ||
      safeIncludes(employee.department)
    ) && (statusFilter === 'all' || employee.user_status === statusFilter);
  });


  const updateEmployeeStatus = async (employeeId: string, newStatus: 'active' | 'inactive') => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/employees/${employeeId}/status`,
        { user_status : newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update local state
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === employeeId ? { ...emp, user_status: newStatus } : emp
        )
      );

      toast({
        title: 'Status Updated',
        description: `Employee is now ${newStatus}`,
      });
    } catch (error) {
      console.error('Status update failed', error);
      toast({
        title: 'Error',
        description: 'Failed to update employee status.',
        variant: 'destructive',
      });
    }
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/employees/${updatedEmployee.id}`,
        updatedEmployee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update state
      setEmployees(prev =>
        prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
      );

      toast({
        title: 'Employee Updated',
        description: 'Changes saved successfully.',
      });
      setIsDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Update failed', error);
      toast({
        title: 'Error',
        description: 'Failed to update employee.',
        variant: 'destructive',
      });
    }
  };


  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          Manage employee accounts and status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.user_status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {employees.filter(e => e.user_status === 'inactive').length}
              </p>
              <p className="text-sm text-gray-600">Inactive</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {employees.filter(e => e.role === 'admin').length}
              </p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                View and manage employee accounts
              </CardDescription>
            </div>
            {/* <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Employee</th>
                  <th className="text-left p-4 font-medium text-gray-900">Department</th>
                  <th className="text-left p-4 font-medium text-gray-900">Role</th>
                  <th className="text-left p-4 font-medium text-gray-900">User Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{employee.username}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{employee.department || <span className="text-gray-400 italic">N/A</span>}</td>
                    <td className="p-4">
                      <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
                        {employee.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={employee.user_status === 'active' ? 'default' : 'destructive'}
                        className={employee.user_status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {employee.user_status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {employee.user_status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEmployeeStatus(employee.id, 'inactive')}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateEmployeeStatus(employee.id, 'active')}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeEditForm
              employee={selectedEmployee}
              onSave={updateEmployee}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EmployeeEditFormProps {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

const EmployeeEditForm = ({ employee, onSave, onCancel }: EmployeeEditFormProps) => {
  const [formData, setFormData] = useState(employee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value: 'employee' | 'admin') =>
          setFormData(prev => ({ ...prev, role: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="user_status">User Status</Label>
        <Select value={formData.user_status} onValueChange={(value: 'active' | 'inactive') =>
          setFormData(prev => ({ ...prev, user_status: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default AdminModule;
