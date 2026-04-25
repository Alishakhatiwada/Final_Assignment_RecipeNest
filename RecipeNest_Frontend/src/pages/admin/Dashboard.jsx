import { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, recipes: 0, pendingRecipes: 0, totalViews: 0, growthData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-20">Loading Stats...</div>;

  const data = stats.growthData && stats.growthData.length > 0 ? stats.growthData : [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]"><StatCard title="Total Users" value={stats.users.toString()} icon="Users" /></div>
        <div className="flex-1 min-w-[200px]"><StatCard title="Total Recipes" value={stats.recipes.toString()} icon="BookOpen" /></div>
        <div className="flex-1 min-w-[200px]"><StatCard title="Pending Recipes" value={stats.pendingRecipes.toString()} icon="Clock" /></div>
        <div className="flex-1 min-w-[200px]"><StatCard title="Total Views" value={stats.totalViews.toString()} icon="Eye" /></div>
      </div>

      <div className="bg-bg-card p-6 rounded-xl border border-borderColor">
         <h3 className="text-lg font-bold text-text-primary mb-6">User and Recipe Growth</h3>
         <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-borderColor)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#00B5D8" strokeWidth={3} dot={{ r: 4, fill: "#00B5D8", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
