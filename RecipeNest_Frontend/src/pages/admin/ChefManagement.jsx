import { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search, Loader2, Star, BookOpen } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function ChefManagement() {
  const [chefs, setChefs] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);

  const fetchChefs = async () => {
    try {
      const res = await api.get('/admin/chefs');
      setChefs(res.data);
      setStats({
        total: res.data.length,
        active: res.data.filter(c => c.status === 'Active').length,
        pending: res.data.filter(c => c.status === 'Pending').length,
      });
    } catch (err) {
      console.error('Fetch chefs error:', err);
      toast.error('Failed to fetch chef accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to retire this chef's license? all their recipes will remain but their account will be gone.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setChefs(chefs.filter(chef => chef._id !== id));
        toast.success('Chef account removed');
      } catch (err) {
        toast.error('Failed to remove chef');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      setChefs(chefs.map(chef => 
        chef._id === id ? { ...chef, status: newStatus } : chef
      ));
      toast.success(`Chef status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredChefs = chefs.filter(chef => 
    (chef.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chef.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chef.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-wrap gap-4">
         <div className="flex-1 min-w-[150px] text-center py-6 bg-white border border-borderColor rounded-2xl shadow-sm">
           <p className="text-xs font-black text-text-muted uppercase tracking-widest">Master Chefs</p>
           <p className="text-3xl font-black text-text-primary mt-1 italic leading-none">{stats.total}</p>
         </div>
         <div className="flex-1 min-w-[150px] text-center py-6 bg-white border border-borderColor rounded-2xl shadow-sm">
           <p className="text-xs font-black text-text-muted uppercase tracking-widest">Active Licenses</p>
           <p className="text-3xl font-black text-primary mt-1 italic leading-none">{stats.active}</p>
         </div>
         <div className="flex-1 min-w-[150px] text-center py-6 bg-white border border-borderColor rounded-2xl shadow-sm">
           <p className="text-xs font-black text-text-muted uppercase tracking-widest">Verification Pending</p>
           <p className="text-3xl font-black text-warning mt-1 italic leading-none">{stats.pending}</p>
         </div>
      </div>

      <div className="bg-white border border-borderColor rounded-2xl overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-borderColor flex justify-between items-center bg-bg-main/50 backdrop-blur-md">
            <div>
               <h3 className="font-black text-text-primary uppercase italic tracking-tight text-xl">Chef Registry</h3>
               <p className="text-xs text-text-secondary font-medium">Verify and manage professional culinary experts</p>
            </div>
            <div className="bg-white border border-borderColor rounded-xl px-4 py-2 flex items-center gap-2 focus-within:border-primary transition-all shadow-sm">
               <Search size={16} className="text-text-secondary" />
               <input 
                 type="text" 
                 placeholder="Search by name or email..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-transparent outline-none text-sm w-[200px] font-medium" 
               />
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-bg-main border-b border-borderColor text-text-muted font-black text-xs uppercase italic tracking-widest">
                <tr>
                  <th className="py-5 px-8">Expert Identity</th>
                  <th className="py-5 px-8">Content Portfolio</th>
                  <th className="py-5 px-8 text-center">Avg Rating</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor">
                {loading ? (
                   <tr>
                      <td colSpan="5" className="py-24 text-center">
                         <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <span className="text-xs font-black uppercase italic text-text-secondary">Retrieving Expert Profiles...</span>
                         </div>
                      </td>
                   </tr>
                ) : filteredChefs.length > 0 ? (
                  filteredChefs.map((chef) => (
                    <tr key={chef._id} className="hover:bg-bg-main/30 transition-colors">
                      <td className="py-5 px-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black overflow-hidden border border-white shadow-sm">
                               {chef.avatar ? <img src={`http://localhost:5000${chef.avatar}`} className="w-full h-full object-cover" /> : chef.username[0].toUpperCase()}
                            </div>
                            <div>
                               <p className="font-black text-text-primary uppercase italic">{chef.fullName || chef.username} {chef.fullName && chef.fullName !== chef.username && <span className="text-[10px] text-text-muted ml-2 normal-case not-italic">({chef.username})</span>}</p>
                               <p className="text-xs font-medium text-text-secondary">{chef.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-5 px-8">
                         <div className="flex items-center gap-1.5 text-text-primary font-black">
                            <BookOpen size={14} className="text-primary" />
                            <span>{chef.recipes} <span className="text-[10px] text-text-muted font-medium uppercase tracking-tighter">Creations</span></span>
                         </div>
                      </td>
                      <td className="py-5 px-8">
                         <div className="flex items-center justify-center gap-1 text-warning font-black">
                            <Star size={14} className="fill-warning" />
                            <span>{chef.rating}</span>
                         </div>
                      </td>
                      <td className="py-5 px-8">
                         <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic border ${
                           chef.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                         }`}>
                           {chef.status}
                         </span>
                      </td>
                      <td className="py-5 px-8">
                         <div className="flex items-center justify-center gap-3">
                           <button onClick={() => setSelectedChef(chef)} title="View Expert" className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Eye size={18} /></button>
                           <button onClick={() => toggleStatus(chef._id, chef.status)} className="p-2 text-text-muted hover:text-warning hover:bg-warning/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                           <button onClick={() => handleDelete(chef._id)} className="p-2 text-text-muted hover:text-danger hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                     <td colSpan="5" className="py-24 text-center text-text-secondary font-bold italic border-b border-dashed border-borderColor bg-bg-main/10">
                        "Your chef library is currently empty."
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      {/* Chef Details Modal */}
      {selectedChef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col relative">
            <button 
              onClick={() => setSelectedChef(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full p-1"
            >
              ✕
            </button>
             <div className="p-8 overflow-y-auto flex-1">
               <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-3xl mb-4 border-4 border-orange-200 overflow-hidden">
                     {selectedChef.avatar ? <img src={`http://localhost:5000${selectedChef.avatar}`} alt="avatar" className="w-full h-full object-cover" /> : (selectedChef.fullName || selectedChef.username)[0].toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-black text-text-primary uppercase italic">{selectedChef.fullName || selectedChef.username}</h2>
                  <p className="text-text-secondary font-medium mt-1">{selectedChef.email}</p>
                  <span className="mt-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-700">
                     Master Chef
                  </span>
               </div>
               
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">License Status</span>
                     <span className={`font-black uppercase italic ${selectedChef.status === 'Active' ? 'text-green-600' : selectedChef.status === 'Pending' ? 'text-warning' : 'text-red-600'}`}>{selectedChef.status}</span>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 flex flex-col items-center justify-center border border-borderColor shadow-inner">
                  <span className="text-3xl font-black text-warning">{selectedChef.rating || '0.0'}</span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Avg Rating</span>
                  </div>
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Username</span>
                     <span className="font-medium text-text-primary">@{selectedChef.username}</span>
                  </div>
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Joined</span>
                     <span className="font-medium text-text-primary">{new Date(selectedChef.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Total Recipes</span>
                     <span className="font-black text-primary">{selectedChef.recipes || 0}</span>
                  </div>
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Average Rating</span>
                     <span className="font-black text-warning flex items-center gap-1"><Star size={14} className="fill-warning"/> {selectedChef.rating || 0}</span>
                  </div>
                  {selectedChef.bio && (
                     <div className="border-b border-borderColor pb-2">
                        <span className="font-bold text-text-muted block mb-1">Culinary Bio</span>
                        <p className="font-medium text-text-primary">{selectedChef.bio}</p>
                     </div>
                  )}
                  {selectedChef.location && (
                     <div className="border-b border-borderColor pb-2">
                        <span className="font-bold text-text-muted block mb-1">Base of Operations</span>
                        <p className="font-medium text-text-primary">{selectedChef.location}</p>
                     </div>
                  )}
               </div>
            </div>
            <div className="bg-bg-main p-4 flex justify-end gap-3 border-t border-borderColor shrink-0">
               <button 
                 onClick={() => {
                    toggleStatus(selectedChef._id, selectedChef.status);
                    setSelectedChef(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
                 }}
                 className="px-6 py-2 bg-white border border-borderColor shadow-sm rounded-xl font-bold text-text-primary hover:border-text-muted transition-all"
               >
                 Toggle Status
               </button>
               <button 
                 onClick={() => setSelectedChef(null)}
                 className="px-6 py-2 bg-primary text-white shadow-sm rounded-xl font-bold hover:bg-primary/90 transition-all"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
