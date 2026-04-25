import { useState, useEffect } from 'react';
import RecipeCard from '../../components/RecipeCard';
import { Filter, Heart, ArrowRight, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SavedRecipes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-text-secondary font-medium italic">Finding your favorites...</p>
    </div>
  );

  const savedRecipes = user?.savedRecipes || [];
  const filteredRecipes = savedRecipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-text-primary uppercase italic tracking-tight">Your Culinary Library</h2>
          <p className="text-text-secondary mt-1 font-medium italic">A collection of recipes that stole your heart.</p>
        </div>
        <div className="w-full md:w-[350px] bg-white border border-borderColor rounded-2xl px-5 py-3 flex items-center gap-3 focus-within:border-primary focus-within:shadow-md transition-all">
           <Search size={20} className="text-text-secondary" />
           <input 
             type="text" 
             placeholder="Search your library..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-transparent outline-none text-text-primary text-sm font-medium"
           />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[2rem] border border-borderColor shadow-sm">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <Heart size={20} className="fill-primary" />
            </div>
            <span className="text-text-primary font-black uppercase italic tracking-widest text-sm">{savedRecipes.length} Saved Creations</span>
         </div>
         <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-all font-black uppercase tracking-tighter text-xs">
            <Filter size={16} /> Filter Results
         </button>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2 animate-in fade-in slide-in-from-bottom-6 duration-700">
           {filteredRecipes.map((recipe) => (
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
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-borderColor rounded-[3rem] bg-bg-card">
           <div className="w-24 h-24 bg-primary-light rounded-[2rem] flex items-center justify-center text-primary mb-6 opacity-40">
              <Heart size={48} />
           </div>
           <h3 className="text-2xl font-black text-text-primary uppercase italic tracking-tight">Your library is empty</h3>
           <p className="text-text-secondary mt-3 max-w-sm font-medium italic">Start exploring the finest world cuisines and save your absolute favorites here for quick access!</p>
           <button 
             onClick={() => navigate('/user/explore')}
             className="mt-10 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group"
           >
              Discover Recipes <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      )}
    </div>
  );
}
