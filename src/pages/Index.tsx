import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import FileUpload from '@/components/FileUpload';
import AdminModule from '@/components/AdminModule';
import ReportsModule from '@/components/ReportsModule';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { useAuthStore } from '@/stores/authStore';

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <Layout>
          <Dashboard />
        </Layout>
      } />
      <Route path="/upload" element={
        <Layout>
          <FileUpload />
        </Layout>
      } />
      {user?.role === 'admin' && (
        <>
          <Route path="/admin" element={
            <Layout>
              <AdminModule />
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout>
              <ReportsModule />
            </Layout>
          } />
        </>
      )}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Index;