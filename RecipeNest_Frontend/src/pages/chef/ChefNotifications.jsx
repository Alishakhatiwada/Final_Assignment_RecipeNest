import { useState, useEffect } from 'react';
import { Bell, Check, Loader2, MessageSquare, Star, Info, AlertTriangle } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function ChefNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'NewReview': return <Star className="text-yellow-500" />;
      case 'RecipeApproved': return <Check className="text-green-500" />;
      case 'RecipeReported': return <AlertTriangle className="text-red-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-borderColor rounded-3xl overflow-hidden shadow-lg">
      <div className="p-8 border-b border-borderColor flex justify-between items-center bg-white relative">
        <div>
           <h2 className="text-2xl font-black text-text-primary uppercase italic tracking-tight">Notification Center</h2>
           <p className="text-sm text-text-secondary font-medium">Monitoring your culinary footprint.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllRead}
            className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
             <Loader2 className="animate-spin text-primary" size={40} />
             <p className="text-xs font-black uppercase tracking-widest text-text-muted italic">Synchronizing Feeds...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="flex flex-col">
             {notifications.map((n) => (
               <div 
                 key={n._id} 
                 className={`p-6 border-b border-borderColor flex gap-5 items-start transition-all hover:bg-bg-main/30 group ${!n.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
               >
                  <div className={`p-3 rounded-2xl flex-shrink-0 ${!n.read ? 'bg-white shadow-md' : 'bg-bg-main'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-black uppercase italic tracking-tight ${!n.read ? 'text-primary' : 'text-text-primary'}`}>{n.title}</h4>
                        <span className="text-[10px] font-black text-text-muted">
                           {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                     <p className="text-sm text-text-secondary font-medium leading-relaxed italic">{n.message}</p>
                     {!n.read && (
                        <button 
                          onClick={() => handleMarkAsRead(n._id)}
                          className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
                        >
                           <Check size={10} /> Mark as seen
                        </button>
                     )}
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-bg-main rounded-[2rem] flex items-center justify-center text-text-muted mb-6 opacity-30 rotate-12">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-black text-text-primary uppercase italic">"Peace & Quiet"</h3>
            <p className="text-text-secondary text-sm mt-2 max-w-xs font-medium">
              Your notifications feed is currently empty. We'll alert you as soon as someone interacts with your masterpieces!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
