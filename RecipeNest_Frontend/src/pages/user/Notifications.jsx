import { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle, Info } from 'lucide-react';
import api from '../../api/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Notifications</h1>
        <p className="text-text-secondary">Manage how you receive notifications.</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-20">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n._id} 
              onClick={() => !n.read && markAsRead(n._id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${n.read ? 'bg-bg-card border-borderColor opacity-70' : 'bg-white border-primary shadow-sm ring-1 ring-primary-light'}`}
            >
               <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-bg-main text-text-muted' : 'bg-primary-light text-primary'}`}>
                  {n.type === 'system' ? <Info size={20} /> : <CheckCircle size={20} />}
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm ${n.read ? 'text-text-secondary' : 'text-text-primary font-bold'}`}>{n.message}</p>
                    {!n.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted font-medium">
                    <Clock size={12} />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
              <Bell size={28} />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">You're all caught up!</h2>
            <p className="text-text-secondary max-w-md">
              No new notifications at the moment. We'll let you know when something important happens!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
