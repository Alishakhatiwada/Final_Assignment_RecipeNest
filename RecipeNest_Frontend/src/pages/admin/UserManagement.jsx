import { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import ChefManagement from './ChefManagement';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      const regularUsers = userRes.data.filter(u => u.role !== 'chef');
      setUsers(regularUsers);
      setStats({
        total: regularUsers.length,
        active: regularUsers.filter(u => u.status === 'Active').length,
        suspended: regularUsers.filter(u => u.status === 'Suspended').length,
      });
    } catch (err) {
      console.error('Fetch users error:', err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
        toast.success('User deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete user');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(users.map(user => 
        user._id === id ? { ...user, status: newStatus } : user
      ));
      toast.success(`User ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex gap-4 border-b border-borderColor pb-2">
        <button 
           className={`px-6 py-3 font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'users' ? 'text-primary border-b-4 border-primary' : 'text-text-muted hover:text-text-primary'}`}
           onClick={() => setActiveTab('users')}
        >
          Regular Users
        </button>
        <button 
           className={`px-6 py-3 font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'chefs' ? 'text-primary border-b-4 border-primary' : 'text-text-muted hover:text-text-primary'}`}
           onClick={() => setActiveTab('chefs')}
        >
          Master Chefs
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          <div className="flex flex-wrap gap-4">
             <div className="flex-1 min-w-[150px] text-center py-6 bg-white border border-borderColor rounded-2xl shadow-sm">
           <p className="text-xs font-black text-text-muted uppercase tracking-widest">Total Users</p>
           <p className="text-3xl font-black text-text-primary mt-1 italic leading-none">{stats.total}</p>
         </div>
         <div className="flex-1 min-w-[150px] text-center py-6 bg-white border border-borderColor rounded-2xl shadow-sm">
           <p className="text-xs font-black text-text-muted uppercase tracking-widest">Active Accounts</p>
           <p className="text-3xl font-black text-green-600 mt-1 italic leading-none">{stats.active}</p>
         </div>
         <div className="flex-1 min-w-[150px] text-center py-6 bg-white border border-borderColor rounded-2xl shadow-sm border-t-4 border-t-red-500">
           <p className="text-xs font-black text-text-muted uppercase tracking-widest">Suspended</p>
           <p className="text-3xl font-black text-red-600 mt-1 italic leading-none">{stats.suspended}</p>
         </div>
      </div>

      <div className="bg-white border border-borderColor rounded-2xl overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-borderColor flex justify-between items-center bg-bg-main/50 backdrop-blur-md">
            <div>
               <h3 className="font-black text-text-primary uppercase italic tracking-tight text-xl">User Directory</h3>
               <p className="text-xs text-text-secondary font-medium">Manage and moderate all platform members</p>
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
            <table className="w-full text-left">
             <thead className="bg-bg-main border-b border-borderColor">
               <tr>
                 <th className="py-5 px-8 text-xs font-black uppercase text-text-muted italic tracking-widest">Member Identity</th>
                 <th className="py-5 px-8 text-xs font-black uppercase text-text-muted italic tracking-widest">Role</th>
                 <th className="py-5 px-8 text-xs font-black uppercase text-text-muted italic tracking-widest text-center">Current Status</th>
                 <th className="py-5 px-8 text-xs font-black uppercase text-text-muted italic tracking-widest text-center">Management</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-borderColor">
               {loading ? (
                 <tr>
                    <td colSpan="4" className="py-20 text-center">
                       <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-primary" size={32} />
                          <span className="text-xs font-black uppercase italic text-text-secondary">Syncing Database...</span>
                       </div>
                    </td>
                 </tr>
               ) : filteredUsers.length > 0 ? (
                 filteredUsers.map((user) => (
                   <tr key={user._id} className="hover:bg-bg-main/30 transition-colors">
                     <td className="py-5 px-8">
                        <p className="font-black text-text-primary uppercase italic">
                           {user.fullName || user.username} 
                           {user.fullName && user.fullName !== user.username && <span className="text-[10px] text-text-muted ml-2 normal-case not-italic">({user.username})</span>}
                        </p>
                        <p className="text-xs font-medium text-text-secondary">{user.email}</p>
                     </td>
                     <td className="py-5 px-8">
                        <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full border ${
                           user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                           user.role === 'chef' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                           'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                           {user.role}
                        </span>
                     </td>
                     <td className="py-5 px-8 text-center">
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest italic ${
                          user.status === 'Active' ? 'bg-green-100/50 text-green-700 border border-green-200' : 'bg-red-100/50 text-red-700 border border-red-200'
                        }`}>
                          {user.status}
                        </span>
                     </td>
                     <td className="py-5 px-8">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => setSelectedUser(user)} title="View User" className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Eye size={18} /></button>
                          <button onClick={() => toggleStatus(user._id, user.status)} title="Toggle Status" className="p-2 text-text-muted hover:text-warning hover:bg-warning/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(user._id)} title="Delete User" className="p-2 text-text-muted hover:text-danger hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                    <td colSpan="4" className="py-20 text-center text-text-secondary font-bold italic border-b border-dashed border-borderColor">
                       "No citizens matching your search parameters were found."
                    </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col relative">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full p-1"
            >
              ✕
            </button>
            <div className="p-8 overflow-y-auto flex-1">
               <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl mb-4 border-2 border-primary/20 overflow-hidden">
                     {selectedUser.avatar ? <img src={`http://localhost:5000${selectedUser.avatar}`} alt="avatar" className="w-full h-full object-cover" /> : (selectedUser.fullName || selectedUser.username)[0].toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-black text-text-primary uppercase italic">{selectedUser.fullName || selectedUser.username}</h2>
                  <p className="text-text-secondary font-medium mt-1">{selectedUser.email}</p>
                  <span className={`mt-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                     selectedUser.role === 'chef' ? 'bg-orange-100 text-orange-700' : 
                     'bg-blue-100 text-blue-700'
                  }`}>
                     {selectedUser.role} Account
                  </span>
               </div>
               
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Status</span>
                     <span className={`font-black uppercase italic ${selectedUser.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{selectedUser.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Username</span>
                     <span className="font-medium text-text-primary">@{selectedUser.username}</span>
                  </div>
                  <div className="flex justify-between border-b border-borderColor pb-2">
                     <span className="font-bold text-text-muted">Joined</span>
                     <span className="font-medium text-text-primary">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedUser.bio && (
                     <div className="border-b border-borderColor pb-2">
                        <span className="font-bold text-text-muted block mb-1">Bio</span>
                        <p className="font-medium text-text-primary">{selectedUser.bio}</p>
                     </div>
                  )}
                  {selectedUser.location && (
                     <div className="border-b border-borderColor pb-2">
                        <span className="font-bold text-text-muted block mb-1">Location</span>
                        <p className="font-medium text-text-primary">{selectedUser.location}</p>
                     </div>
                  )}
               </div>
            </div>
            <div className="bg-bg-main p-4 flex justify-end border-t border-borderColor shrink-0">
               <button 
                 onClick={() => setSelectedUser(null)}
                 className="px-6 py-2 bg-white border border-borderColor shadow-sm rounded-xl font-bold text-text-secondary hover:text-text-primary hover:border-text-muted transition-all"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
        </>
      ) : (
        <ChefManagement />
      )}
    </div>
  );
}
