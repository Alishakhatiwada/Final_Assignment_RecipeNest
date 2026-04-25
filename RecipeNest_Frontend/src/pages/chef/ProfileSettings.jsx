import { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPass, setUpdatingPass] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setUpdatingPass(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Password updated successfully");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update password");
    } finally {
      setUpdatingPass(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
       <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 bg-primary rounded-full flex flex-shrink-0 items-center justify-center text-5xl text-white shadow-sm border-4 border-bg-main relative overflow-hidden">
             {user.avatar ? (
                <img src={`http://localhost:5000${user.avatar}`} className="w-full h-full object-cover" alt="avatar" />
             ) : '👤'}
          </div>
          <div className="flex-1 text-center md:text-left">
             <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
               <div>
                 <h2 className="text-2xl font-bold text-text-primary">{user.fullName || user.username}</h2>
                 <p className="text-sm font-medium text-text-secondary mt-1">Professional Chef</p>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-text-muted mt-2">
                   <span>{user.location || 'Location Not Set'}</span>
                   <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                   <span>{user.email}</span>
                 </div>
               </div>
               <button 
                 onClick={() => navigate('/chef/profile/edit')}
                 className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0"
               >
                 Edit Profile
               </button>
             </div>
             <p className="text-sm text-text-secondary mt-4 max-w-2xl leading-relaxed">
               {user.bio || "No professional bio provided yet."}
             </p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col">
             <h3 className="text-lg font-bold text-text-primary mb-6">Security Settings</h3>
             <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-text-primary">Current Password</label>
                   <input 
                     type="password" 
                     value={passwords.currentPassword}
                     onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                     placeholder="********" 
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-text-primary">New Password</label>
                   <input 
                     type="password" 
                     value={passwords.newPassword}
                     onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                     placeholder="Enter new password" 
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
                   <input 
                     type="password" 
                     value={passwords.confirmPassword}
                     onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                     placeholder="Confirm new password" 
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                   />
                </div>
                <div className="flex justify-between items-center mt-4">
                   <button 
                     type="submit"
                     disabled={updatingPass}
                     className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                   >
                     {updatingPass && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                     Save Changes
                   </button>
                   <button 
                     type="button"
                     onClick={() => logout()}
                     className="text-danger font-medium hover:underline text-sm"
                   >
                     Logout
                   </button>
                </div>
             </form>
          </div>

          <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col">
             <h3 className="text-lg font-bold text-text-primary mb-6">Notification Preferences</h3>
             <div className="flex flex-col gap-6">
                {[
                  { id: 'recipe-likes', label: 'Recipe Likes', desc: 'Notify me when someone likes my recipe' },
                  { id: 'new-reviews', label: 'New Reviews', desc: 'Notify me when I receive a new review' },
                  { id: 'marketing', label: 'Marketing Emails', desc: 'Receive updates about new platform features' }
                ].map((pref) => (
                   <div key={pref.id} className="flex items-center justify-between gap-4 group">
                      <div>
                         <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{pref.label}</p>
                         <p className="text-xs text-text-muted mt-1">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={pref.id !== 'marketing'} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                   </div>
                ))}
                <p className="text-xs text-text-muted mt-2 p-3 bg-bg-main rounded-lg italic">
                  Note: Essential account security alerts cannot be disabled.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
