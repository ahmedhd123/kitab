'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';

const AdminPage = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminPage;
