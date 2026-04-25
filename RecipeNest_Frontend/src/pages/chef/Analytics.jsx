import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Loader2 } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/chef/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching chef analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="py-20 flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-sm font-bold uppercase italic tracking-widest text-text-secondary">Syncing Culinary Metrics...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
       <div className="bg-bg-card p-6 rounded-xl border border-borderColor">
         <h2 className="text-xl font-bold text-text-primary mb-6">Monthly Recipe Views</h2>
         <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-borderColor)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#00B5D8" strokeWidth={3} dot={{ r: 4, fill: "#00B5D8", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
               </LineChart>
            </ResponsiveContainer>
         </div>
       </div>
    </div>
  );
}
