import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Clock, Eye, MessageSquare, Heart } from 'lucide-react';
import api from '../../api/api';

export default function ChefViewRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading Recipe Details...</div>;
  if (!recipe) return <div className="text-center py-20 text-danger">Recipe not found.</div>;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <button onClick={() => navigate(-1)} className="text-primary hover:underline self-start font-medium leading-none">
        &larr; Back to Recipes
      </button>

      {/* Admin/Stats Bar */}
      <div className="bg-bg-card border border-primary p-4 rounded-xl flex flex-wrap gap-6 items-center justify-between">
         <div className="flex items-center gap-2">
            <span className={`text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${recipe.status === 'Published' ? 'bg-green-500' : 'bg-primary'}`}>{recipe.status}</span>
            <span className="text-text-primary font-medium">Recipe Performance</span>
         </div>
         <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-text-secondary"><Eye size={16}/> {recipe.views} Views</div>
            <div className="flex items-center gap-2 text-text-secondary"><Heart size={16}/> {recipe.saves} Saves</div>
            <div className="flex items-center gap-2 text-text-secondary"><MessageSquare size={16}/> {recipe.reviews?.length || 0} Reviews</div>
         </div>
         <button onClick={() => navigate(`/chef/recipes/edit/${id}`)} className="bg-primary-light text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-sm border border-primary">
            Edit Recipe
         </button>
      </div>

      {/* Header Image */}
      <div className="w-full h-[300px] md:h-[400px] bg-bg-card rounded-2xl overflow-hidden relative border border-borderColor flex items-center justify-center text-8xl">
         {recipe.image ? <img src={`http://localhost:5000${recipe.image}`} className="w-full h-full object-cover" /> : '🍝'}
      </div>

      {/* Title & Meta */}
      <div className="border-b border-borderColor pb-6">
         <h1 className="text-3xl font-bold text-text-primary mb-2">{recipe.title}</h1>
         <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center gap-1 font-medium">
               <Star size={18} className="text-warning" fill="var(--color-warning)" />
               <span className="text-text-primary">{recipe.rating}</span>
               <span className="text-text-muted">({recipe.reviews?.length || 0} Reviews)</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-text-secondary">
               <Clock size={18} />
               <span>{recipe.cookingTime} mins</span>
            </div>
         </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-12">
         {/* Ingredients */}
         <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold text-primary mb-6">Ingredients</h3>
            <div className="bg-bg-card border border-borderColor rounded-xl p-6">
               <ul className="flex flex-col gap-4 text-text-secondary">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3"><span className="text-primary mt-1">•</span> {ing}</li>
                  ))}
               </ul>
            </div>
         </div>

         {/* Instructions */}
         <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-6">Instructions</h3>
            <div className="bg-bg-card border border-borderColor rounded-xl p-6 md:p-8">
               <ol className="flex flex-col gap-6 text-text-secondary">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                       <span className="font-bold text-text-primary bg-bg-main w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-borderColor">{idx + 1}</span>
                       <p className="mt-1">{step}</p>
                    </li>
                  ))}
               </ol>
            </div>
         </div>
      </div>
    </div>
  );
}
