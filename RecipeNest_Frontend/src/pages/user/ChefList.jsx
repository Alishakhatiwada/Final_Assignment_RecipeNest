import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, Star, Utensils } from 'lucide-react';
import api from '../../api/api';

export default function ChefList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await api.get('/chef/all');
        setChefs(res.data);
      } catch (err) {
        console.error('Fetch chefs error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  const filteredChefs = chefs.filter(chef => 
    chef.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (chef.specialty && chef.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-text-primary italic">Our Culinary Masters</h2>
          <p className="text-text-secondary mt-1 font-medium">Learn from the best chefs in the community</p>
        </div>
        <div className="w-full md:w-[400px] bg-white border border-borderColor rounded-xl px-5 py-3.5 flex items-center gap-3 focus-within:border-primary focus-within:shadow-md transition-all">
            <Search size={20} className="text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by name or specialty..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-text-primary text-sm font-medium"
            />
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
           {Array(8).fill(0).map((_, i) => (
             <div key={i} className="bg-bg-card border border-borderColor p-8 rounded-2xl flex flex-col items-center animate-pulse">
                <div className="w-24 h-24 bg-bg-main rounded-full mb-4"></div>
                <div className="h-4 bg-bg-main rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-bg-main rounded w-3/4 mb-4"></div>
                <div className="flex gap-2 w-full">
                   <div className="h-6 bg-bg-main rounded flex-1"></div>
                   <div className="h-6 bg-bg-main rounded flex-1"></div>
                </div>
             </div>
           ))}
        </div>
      ) : filteredChefs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
           {filteredChefs.map((chef) => (
             <div 
               key={chef._id} 
               onClick={() => navigate(`/user/chef/${chef._id}`)}
               className="bg-bg-card border border-borderColor p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
             >
                <div className="w-28 h-28 rounded-full mb-5 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
                   {chef.avatar ? (
                     <img src={`http://localhost:5000${chef.avatar}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={chef.username} />
                   ) : (
                     <div className="w-full h-full bg-primary-light text-primary flex items-center justify-center text-4xl">
                        <UserIcon size={40} />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="font-bold text-xl text-text-primary mb-1 group-hover:text-primary transition-colors">{chef.username}</h4>
                <p className="text-sm text-text-muted font-medium mb-5">{chef.bio?.substring(0, 40) || 'Culinary enthusiast'}...</p>
                <div className="flex items-center gap-3 w-full">
                   <div className="flex-1 bg-bg-main p-2.5 rounded-xl flex flex-col items-center gap-1 border border-borderColor/50">
                      <Star size={14} className="text-warning fill-warning" />
                      <span className="text-[10px] uppercase font-black text-text-primary tracking-tighter">Top Rated</span>
                   </div>
                   <div className="flex-1 bg-primary-light/30 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-primary-light/50">
                      <Utensils size={14} className="text-primary" />
                      <span className="text-[10px] uppercase font-black text-primary tracking-tighter">Pro Chef</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-bg-card border-2 border-dashed border-borderColor rounded-3xl">
           <p className="text-text-secondary font-medium text-lg">No chefs found matching "{searchQuery}"</p>
           <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold hover:underline">View all chefs</button>
        </div>
      )}
    </div>
  );
}
