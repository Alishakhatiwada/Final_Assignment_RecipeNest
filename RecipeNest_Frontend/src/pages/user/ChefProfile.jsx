import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { Mail, MapPin, Star, Utensils, Award, Users } from 'lucide-react';
import api from '../../api/api';

export default function ChefProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const ratedRecipes = recipes.filter(r => r.rating > 0);
  const avgRating = ratedRecipes.length > 0 
    ? (ratedRecipes.reduce((acc, r) => acc + r.rating, 0) / ratedRecipes.length).toFixed(1)
    : '0.0';

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        const res = await api.get(`/chef/profile/${id}`);
        setChef(res.data.chef);
        setRecipes(res.data.recipes);
      } catch (err) {
        console.error('Fetch chef profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChefData();
  }, [id]);

  if (loading) return <div className="text-center py-20 flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-text-secondary font-medium italic">Loading master chef profile...</p>
  </div>;

  if (!chef) return <div className="text-center py-20 text-danger font-bold">Chef not found.</div>;

  return (
    <div className="flex flex-col gap-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-muted hover:text-primary self-start font-bold transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Discovery
      </button>
      
      <div className="bg-white border border-borderColor rounded-[3rem] p-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left relative overflow-hidden shadow-xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%]"></div>
        
        <div className="w-40 h-40 rounded-full flex flex-shrink-0 items-center justify-center border-8 border-bg-main shadow-2xl overflow-hidden relative group">
          {chef.avatar ? (
            <img src={`http://localhost:5000${chef.avatar}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={chef.username} />
          ) : (
            <div className="w-full h-full bg-primary text-white flex items-center justify-center text-6xl font-black italic">
               {chef.username[0]}
            </div>
          )}
        </div>

        <div className="flex-1 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
             <div>
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                 <h1 className="text-5xl font-black text-text-primary italic tracking-tight uppercase">{chef.fullName || chef.username}</h1>
                 <Award className="text-warning animate-bounce" />
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                 <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{chef.role} Account</span>
                 {chef.location && (
                   <span className="bg-bg-main border border-borderColor text-text-secondary px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                      <MapPin size={12} className="text-primary" /> {chef.location}
                   </span>
                 )}
              </div>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-bg-card border border-borderColor px-6 py-4 rounded-3xl flex flex-col items-center gap-1 shadow-sm">
                  <span className="text-2xl font-black text-primary italic leading-none">{recipes.length}</span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Recipes</span>
               </div>
               <div className="bg-bg-card border border-borderColor px-6 py-4 rounded-3xl flex flex-col items-center gap-1 shadow-sm">
                  <span className="text-2xl font-black text-warning italic leading-none">{avgRating}</span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Rating</span>
               </div>
            </div>
          </div>
          
          {chef.bio && (
            <div className="bg-bg-main/50 p-6 rounded-3xl border border-borderColor/50 mb-8 max-w-3xl">
               <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">About the Chef</h4>
               <p className="text-text-secondary leading-relaxed font-medium italic">"{chef.bio}"</p>
            </div>
          )}

          <div className="flex flex-wrap gap-6 text-sm font-bold text-text-primary justify-center md:justify-start">
             <button 
               onClick={() => navigate(`/user/messages?contact=${chef._id}`)}
               className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
             >
                <Mail size={18} />
                <span>Message Chef</span>
             </button>
             <a href={`mailto:${chef.email}`} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-borderColor cursor-pointer hover:border-primary transition-all">
                <Mail size={18} className="text-primary" />
                <span>Original Email</span>
             </a>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-8">
           <div>
             <h2 className="text-3xl font-black text-text-primary italic uppercase tracking-tight">Chef's Gourmet Collection</h2>
             <div className="h-1.5 w-24 bg-primary rounded-full mt-2"></div>
           </div>
           <span className="text-text-muted font-bold text-sm bg-bg-card px-4 py-2 rounded-xl border border-borderColor">
              {recipes.length} CREATIONS
           </span>
        </div>
        
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
               <RecipeCard 
                  key={recipe._id} 
                  id={recipe._id}
                  title={recipe.title}
                  chef={chef.fullName || chef.username}
                  rating={recipe.rating}
                  time={recipe.cookingTime}
                  image={recipe.image ? `http://localhost:5000${recipe.image}` : null}
                  category={recipe.category}
               />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-borderColor rounded-[3rem] bg-bg-card">
             <Utensils size={40} className="mx-auto text-text-muted mb-4 opacity-30" />
             <p className="text-text-secondary font-bold">This chef hasn't shared any recipes yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
