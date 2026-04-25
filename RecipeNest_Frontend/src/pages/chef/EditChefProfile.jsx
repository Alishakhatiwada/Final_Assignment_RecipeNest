import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function EditChefProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    email: user?.email || '',
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `http://localhost:5000${user.avatar}` : null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('bio', formData.bio);
    data.append('location', formData.location);
    if (avatar) {
      data.append('avatar', avatar);
    }

    try {
      const res = await api.put('/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      toast.success('Profile updated!');
      navigate('/chef/profile');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between bg-bg-card p-6 rounded-xl border border-borderColor">
         <div>
            <h2 className="text-xl font-bold text-text-primary">Edit Chef Profile</h2>
            <p className="text-sm text-text-secondary mt-1">Update your professional information and bio.</p>
         </div>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col gap-8">
         <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
               <div className="w-32 h-32 bg-primary rounded-full flex flex-shrink-0 items-center justify-center text-5xl text-white shadow-sm border-4 border-bg-main overflow-hidden">
                  {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : '👤'}
               </div>
               <button 
                 type="button"
                 onClick={() => fileInputRef.current.click()}
                 className="absolute bottom-0 right-0 w-10 h-10 bg-primary-light border-2 border-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
               >
                  <Camera size={18} />
               </button>
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>
            
            <div className="flex-1 w-full flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-text-primary">Chef Name / Display Name</label>
                 <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-text-primary">Professional Bio</label>
                 <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary resize-none"></textarea>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Email Address</label>
                   <input type="email" value={formData.email} disabled className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary opacity-60" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Location</label>
                   <input name="location" value={formData.location} onChange={handleChange} type="text" className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" />
                 </div>
               </div>
            </div>
         </div>

         <div className="flex gap-4 justify-end mt-4 pt-6 border-t border-borderColor">
            <button 
              className="text-text-secondary px-6 py-2 rounded-lg font-medium hover:bg-bg-main transition-colors"
              onClick={() => navigate('/chef/profile')}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Save Profile
            </button>
         </div>
      </div>
    </div>
  );
}
