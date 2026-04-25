import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  // Administrative email is constant as requested
  const ADMIN_EMAIL = 'admin@gmail.com';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate API call for password update
    alert("Administrative Password Updated Successfully!");
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
       <div className="bg-bg-card p-6 rounded-xl border border-borderColor flex justify-between items-center">
         <div>
            <h2 className="text-xl font-bold text-text-primary">Platform Settings</h2>
            <p className="text-sm text-text-secondary mt-1">Manage global system settings and administrative actions.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col gap-6">
             <h3 className="text-lg font-bold text-text-primary border-b border-borderColor pb-2">Admin Profile</h3>
             
             <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Admin Email (Static)</label>
                   <input 
                     type="email" 
                     value={ADMIN_EMAIL} 
                     readOnly
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none text-text-muted cursor-not-allowed" 
                     title="Administrative email cannot be changed"
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Update Password</label>
                   <input 
                     type="password" 
                     placeholder="New Password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Confirm Password</label>
                   <input 
                     type="password" 
                     placeholder="Confirm Password" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                   />
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center justify-center gap-2 mt-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors"
                >
                  <Save size={18} /> Save Profile
                </button>
             </div>
          </div>

          <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col gap-6">
             <h3 className="text-lg font-bold text-text-primary border-b border-borderColor pb-2">System Preferences</h3>
             
             <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                   <div>
                     <p className="font-semibold text-text-primary">Chef Registrations</p>
                     <p className="text-xs text-text-secondary">Allow new professional chefs to sign up.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                </div>
                
                <div className="flex items-center justify-between">
                   <div>
                     <p className="font-semibold text-text-primary">Auto-Approve Recipes</p>
                     <p className="text-xs text-text-secondary">Automatically publish strictly moderated recipes.</p>
                   </div>
                   <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
                </div>
                
                <div className="flex items-center justify-between">
                   <div>
                     <p className="font-semibold text-text-primary">Maintenance Mode</p>
                     <p className="text-xs text-text-secondary">Display under-construction banner to users.</p>
                   </div>
                   <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
                </div>
             </div>

             <div className="mt-auto pt-6 border-t border-borderColor">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 border border-danger text-danger hover:bg-red-50 py-3 rounded-lg font-medium transition-colors"
                >
                  <LogOut size={18} /> Terminate Session & Logout
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
