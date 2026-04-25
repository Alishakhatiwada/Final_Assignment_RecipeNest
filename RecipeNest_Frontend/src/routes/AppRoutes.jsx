import { Routes, Route } from 'react-router-dom';
import SplashPage from '../pages/auth/SplashPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import UserLayout from '../pages/user/UserLayout';
import ChefLayout from '../pages/chef/ChefLayout';
import AdminLayout from '../pages/admin/AdminLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/*" element={<UserLayout />} />
      <Route path="/chef/*" element={<ChefLayout />} />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  )
}
