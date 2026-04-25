import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { Star, Clock, Trophy, Users, ChefHat, ArrowRight } from 'lucide-react';
import api from '../../api/api';

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [recipes, setRecipes] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recipeRes, chefRes, catRes] = await Promise.all([
        api.get(`/recipes?category=${activeCategory === 'All' ? '' : activeCategory}`),
        api.get('/chef/all'),
        api.get('/categories')
      ]);
      setRecipes(recipeRes.data);
      setChefs(chefRes.data);
      setCategories(['All', ...catRes.data.map(c => c.title)]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const featuredRecipe = recipes.length > 0 ? recipes[0] : null;

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Dynamic Hero Section */}
      {featuredRecipe ? (
        <div className="group relative w-full h-[450px] md:h-[550px] bg-bg-card rounded-[3rem] overflow-hidden border border-borderColor shadow-2xl transition-all duration-700 hover:shadow-primary/20">
           {featuredRecipe.image ? (
             <img 
               src={`http://localhost:5000${featuredRecipe.image}`} 
               alt={featuredRecipe.title} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
             />
           ) : (
             <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-9xl">🍳</div>
           )}
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
           
           <div className="absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2 flex flex-col items-start gap-4 max-w-[500px] animate-in slide-in-from-left duration-700">
              <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                 <Trophy size={14} className="mb-0.5" /> Featured Masterpiece
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-2 line-clamp-2">
                 {featuredRecipe.title}
              </h2>
              <p className="text-white/80 font-medium text-lg leading-relaxed mb-4">
                 "Experience the authentic flavors crafted by {featuredRecipe.chef?.username || 'the community'}. A perfect blend of tradition and taste."
              </p>
              <div className="flex items-center gap-6 mb-6">
                 <div className="flex items-center gap-2 text-white/90 font-bold">
                    <Clock size={20} className="text-primary" />
                    <span>{featuredRecipe.cookingTime}</span>
                 </div>
                 <div className="flex items-center gap-2 text-white/90 font-bold">
                    <Star size={20} className="text-warning fill-warning" />
                    <span>{featuredRecipe.rating} (Verified)</span>
                 </div>
              </div>
              <button 
                onClick={() => navigate(`/user/recipe/${featuredRecipe._id}`)}
                className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/40 active:scale-95 flex items-center gap-3"
              >
                 Master This Recipe <ArrowRight size={20} />
              </button>
           </div>
        </div>
      ) : loading ? (
        <div className="w-full h-[500px] bg-bg-card rounded-[3rem] animate-pulse"></div>
      ) : null}

      {/* Categories Horizontal Scroller */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight">Explore Categories</h3>
           <div className="h-1.5 w-24 bg-primary rounded-full"></div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat)}
               className={`whitespace-nowrap px-8 py-4 border-2 rounded-[1.2rem] text-sm font-black uppercase tracking-widest transition-all ${
                 activeCategory === cat 
                 ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                 : 'bg-white border-borderColor text-text-muted hover:border-primary hover:text-primary active:scale-95'
               }`}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      {/* Popular Recipes Grid */}
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-end border-b border-borderColor pb-6">
           <div>
              <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight">Trending Now</h3>
              <p className="text-text-secondary font-medium mt-1">Most loved recipes this week</p>
           </div>
           <button 
             onClick={() => navigate('/user/explore')}
             className="text-sm text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-2"
           >
              View All <ArrowRight size={16} />
           </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
             {[1,2,3,4,5,6,7,8].map(i => (
               <div key={i} className="bg-bg-card rounded-[2rem] h-[300px] animate-pulse"></div>
             ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
             {recipes.map(recipe => (
                <RecipeCard 
                  key={recipe._id} 
                  id={recipe._id}
                  title={recipe.title}
                  chef={recipe.chef?.username || 'Unknown Chef'}
                  rating={recipe.rating}
                  time={recipe.cookingTime}
                  image={recipe.image ? `http://localhost:5000${recipe.image}` : null}
                  category={recipe.category}
                />
             ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-borderColor rounded-[3rem] bg-bg-card text-text-secondary font-bold">
            "We're currently perfecting the recipes for this collection. Check back soon!"
          </div>
        )}
      </div>

      {/* Top Chefs Section */}
      <div className="bg-bg-card border border-borderColor rounded-[3rem] p-12 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-br-[100%] pointer-events-none"></div>
        <div className="relative z-10">
           <div className="flex flex-col items-center mb-12 text-center">
              <div className="bg-primary/10 text-primary p-3 rounded-2xl mb-4"><ChefHat size={32} /></div>
              <h3 className="text-4xl font-black text-text-primary uppercase tracking-tight">Our Master Chefs</h3>
              <p className="text-text-secondary font-medium tracking-wide">The creative minds behind your favorite dishes</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-48 bg-bg-main rounded-[2.5rem] animate-pulse"></div>)
              ) : (
                chefs.slice(0, 4).map((chef) => (
                  <div 
                    key={chef._id} 
                    onClick={() => navigate(`/user/chef/${chef._id}`)}
                    className="bg-white border border-borderColor p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
                  >
                    <div className="w-24 h-24 rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
                      {chef.avatar ? <img src={`http://localhost:5000${chef.avatar}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <Users size={32} className="text-primary-light" />}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h4 className="font-black text-xl text-text-primary mb-1 uppercase tracking-tight">{chef.username}</h4>
                    <p className="text-[10px] font-black text-primary uppercase bg-primary-light/50 px-4 py-1.5 rounded-full tracking-tighter">Verified Creator</p>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
