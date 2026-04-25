import { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import RecipeCard from '../../components/RecipeCard';
import api from '../../api/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRecipes: 0, totalViews: 0, totalSaves: 0, avgRating: 0 });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        const statsRes = await api.get('/chef/stats');
        setStats(statsRes.data);

        const recipesRes = await api.get('/recipes/chef');
        setRecentRecipes(recipesRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching chef dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChefData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;

  const popularRecipe = recentRecipes.length > 0 ? recentRecipes[0] : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Stats row */}
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]"><StatCard title="My Recipes" value={stats.totalRecipes.toString()} icon="BookOpen" /></div>
        <div className="flex-1 min-w-[200px]"><StatCard title="Total Saved" value={stats.totalSaves.toString()} icon="Heart" /></div>
        <div className="flex-1 min-w-[200px]"><StatCard title="Avg Rating" value={stats.avgRating.toString()} icon="Star" /></div>
        <div className="flex-1 min-w-[200px]"><StatCard title="Total Views" value={stats.totalViews.toString()} icon="Eye" /></div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-8">
         {/* Most Popular Recipe Card - Large Orange Area */}
         <div className="xl:w-2/3 bg-primary rounded-xl overflow-hidden shadow-sm flex flex-col relative">
            <div className="p-8 pb-32">
               <span className="text-white/80 font-bold text-xs uppercase tracking-wider mb-2 block">Most Popular Recipe</span>
               <h2 className="text-3xl font-bold text-white mb-2">{popularRecipe ? popularRecipe.title : "No recipes yet"}</h2>
               <div className="flex gap-8 mt-6">
                  <div>
                     <p className="text-white/80 text-sm">Views</p>
                     <p className="text-white font-bold text-xl">{popularRecipe ? (popularRecipe.views || 0) : '0'}</p>
                  </div>
                  <div>
                     <p className="text-white/80 text-sm">Saved</p>
                     <p className="text-white font-bold text-xl">{popularRecipe ? (popularRecipe.saves || 0) : '0'}</p>
                  </div>
                  <div>
                     <p className="text-white/80 text-sm">Rating</p>
                     <p className="text-white font-bold text-xl">{popularRecipe ? (popularRecipe.rating || 0) : '0'}</p>
                  </div>
               </div>
            </div>
            {/* The white cut-out underneath mimicking the screenshot pattern */}
            <div className="absolute bottom-0 left-0 w-full bg-bg-main h-16 rounded-tl-2xl"></div>
         </div>

         {/* Recently Added List */}
         <div className="xl:w-1/3">
            <h3 className="text-lg font-bold text-text-primary mb-4">Recently Added</h3>
            <div className="flex flex-col gap-4">
               {recentRecipes.length > 0 ? (
                 recentRecipes.map(recipe => (
                   <div key={recipe._id} className="w-full">
                      <RecipeCard 
                         id={recipe._id}
                         title={recipe.title}
                         chef="You"
                         rating={recipe.rating}
                         time={recipe.cookingTime}
                         image={recipe.image ? `http://localhost:5000${recipe.image}` : null}
                         category={recipe.category}
                         basePath="/chef/recipe/" 
                      />
                   </div>
                 ))
               ) : (
                 <p className="text-sm text-text-secondary italic">Start adding recipes to see them here.</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
