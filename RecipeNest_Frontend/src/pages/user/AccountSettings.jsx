import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function AccountSettings() {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Account Settings</h1>
        <p className="text-text-secondary">Manage your account information and security.</p>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-borderColor pb-2">Profile Information</h2>
        <div className="flex flex-col gap-4">
           <div>
             <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
             <p className="text-text-primary font-medium">{user.fullName || user.username}</p>
           </div>
           <div>
             <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
             <p className="text-text-primary font-medium">{user.email}</p>
           </div>
        </div>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-borderColor pb-2">Change Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
            <input 
              type="password"
              name="currentPassword"
              required
              value={passwordData.currentPassword}
              onChange={handleChange}
              className="w-full bg-bg-main border border-borderColor rounded-lg px-4 py-2 text-text-primary focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
            <input 
              type="password"
              name="newPassword"
              required
              value={passwordData.newPassword}
              onChange={handleChange}
              className="w-full bg-bg-main border border-borderColor rounded-lg px-4 py-2 text-text-primary focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
            <input 
              type="password"
              name="confirmPassword"
              required
              value={passwordData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-bg-main border border-borderColor rounded-lg px-4 py-2 text-text-primary focus:border-primary outline-none transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-primary text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors self-start flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
