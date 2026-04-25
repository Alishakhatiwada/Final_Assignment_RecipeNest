import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    email: user?.email || '',
    location: user?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `http://localhost:5000${user.avatar}` : null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, avatar: res.data.url });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', formData);
      setUser(res.data);
      navigate('/user/profile');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-bg-card p-6 rounded-xl border border-borderColor">
         <div>
            <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
            <p className="text-sm text-text-secondary mt-1">Update your personal information.</p>
         </div>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col gap-8">
         <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
               <div className="w-32 h-32 bg-primary rounded-full flex flex-shrink-0 items-center justify-center text-5xl text-white shadow-sm border-4 border-bg-main overflow-hidden">
                  {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : '👤'}
               </div>
               <button 
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary-light border-2 border-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
               >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
               />
            </div>
            
            <div className="flex-1 w-full flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-text-primary">Full Name</label>
                 <input 
                   type="text" 
                   name="fullName"
                   value={formData.fullName}
                   onChange={handleChange}
                   className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                 />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-text-primary">Bio</label>
                 <textarea 
                   rows="3" 
                   name="bio"
                   value={formData.bio}
                   onChange={handleChange}
                   className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary resize-none"
                 ></textarea>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Email Address</label>
                   <input 
                     type="email" 
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary opacity-60 cursor-not-allowed" 
                     disabled
                   />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-text-primary">Location</label>
                   <input 
                     type="text" 
                     name="location"
                     value={formData.location}
                     onChange={handleChange}
                     className="p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary" 
                   />
                 </div>
               </div>
            </div>
         </div>

         <div className="flex gap-4 justify-end mt-4 pt-6 border-t border-borderColor">
            <button 
              className="text-text-secondary px-6 py-2 rounded-lg font-medium hover:bg-bg-main transition-colors"
              onClick={() => navigate('/user/profile')}
            >
              Cancel
            </button>
            <button 
              className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              onClick={handleSave}
              disabled={loading || uploading}
            >
              {(loading || uploading) && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
         </div>
      </div>
    </div>
  );
}
