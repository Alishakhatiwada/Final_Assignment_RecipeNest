import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Heart, Share2, MessageCircle, Send } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function ViewRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeRes, reviewsRes] = await Promise.all([
          api.get(`/recipes/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setRecipe(recipeRes.data);
        setReviews(reviewsRes.data);
        
        if (user && user.savedRecipes?.some(r => r._id === id || r === id)) {
          setIsSaved(true);
        }

        // Increment views
        api.post(`/recipes/${id}/view`).catch(e => console.error(e));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save recipes');
      return;
    }
    try {
      const res = await api.post(`/recipes/${id}/save`);
      setIsSaved(!isSaved);
      
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      
      toast.success(res.data.msg || res.data.message || 'Saved successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    try {
      const res = await api.post(`/reviews/${id}`, newReview);
      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-text-secondary font-medium">Brewing recipe details...</p>
  </div>;

  if (!recipe) return <div className="text-center py-20 text-danger font-bold">Recipe not found.</div>;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Image */}
      <div className="w-full h-[300px] md:h-[400px] bg-primary-light rounded-2xl overflow-hidden relative border border-borderColor shadow-lg">
         <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button 
              onClick={handleSave}
              className={`p-2 rounded-full transition-all shadow-md ${isSaved ? 'bg-danger text-white scale-110' : 'bg-white/90 backdrop-blur text-text-secondary hover:text-danger'}`}
            >
               <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/90 backdrop-blur p-2 rounded-full text-text-secondary hover:text-primary transition-all shadow-md active:scale-95"
            >
               <Share2 size={20} />
            </button>
         </div>
         {recipe.image ? (
           <img src={`http://localhost:5000${recipe.image}`} className="w-full h-full object-cover" alt={recipe.title} />
         ) : (
           <div className="w-full h-full flex items-center justify-center opacity-30 text-8xl">🍝</div>
         )}
      </div>

      {/* Title & Meta */}
      <div className="border-b border-borderColor pb-6">
         <div className="flex justify-between items-start gap-4">
            <h1 className="text-4xl font-bold text-text-primary mb-2">{recipe.title}</h1>
            <div className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               {recipe.category}
            </div>
         </div>
         <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-text-secondary font-medium hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/user/chef/${recipe.chef?._id}`)}>
               <div className="w-10 h-10 bg-bg-card rounded-full border-2 border-primary-light overflow-hidden flex items-center justify-center">
                  {recipe.chef?.avatar ? <img src={`http://localhost:5000${recipe.chef.avatar}`} className="w-full h-full object-cover" /> : '👨‍🍳'}
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted leading-tight">Prepared By</span>
                  <span className="text-sm">{recipe.chef?.fullName || recipe.chef?.username}</span>
               </div>
            </div>
            <div className="flex items-center gap-1 font-medium bg-warning-light/20 px-3 py-1.5 rounded-lg">
               <Star size={18} className="text-warning" fill="currentColor" />
               <span className="text-text-primary">{recipe.rating}</span>
               <span className="text-text-muted text-sm ml-1">({reviews.length} Reviews)</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-text-secondary bg-bg-card px-3 py-1.5 rounded-lg border border-borderColor">
               <Clock size={18} />
               <span>{recipe.cookingTime}</span>
            </div>
         </div>
         {recipe.description && (
           <p className="mt-6 text-text-secondary leading-relaxed max-w-4xl italic">"{recipe.description}"</p>
         )}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-12">
         {/* Ingredients */}
         <div className="w-full lg:w-[380px]">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
               <div className="w-2 h-6 bg-primary rounded-full"></div>
               Ingredients
            </h3>
            <div className="bg-bg-card border border-borderColor rounded-2xl p-6 shadow-sm">
               <ul className="flex flex-col gap-4 text-text-secondary">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-2 hover:bg-bg-main rounded-lg transition-colors">
                       <div className="w-5 h-5 rounded bg-primary-light flex items-center justify-center text-primary text-xs font-bold mt-0.5 mt-0.5">•</div>
                       <span className="text-sm">{ing}</span>
                    </li>
                  ))}
               </ul>
            </div>
         </div>

         {/* Instructions */}
         <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
               <div className="w-2 h-6 bg-primary rounded-full"></div>
               Step-by-Step Guide
            </h3>
            <div className="bg-bg-card border border-borderColor rounded-2xl p-6 md:p-8 shadow-sm">
               <ol className="flex flex-col gap-8 text-text-secondary">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-6 relative group">
                       <span className="font-black text-white bg-primary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          {idx + 1}
                       </span>
                       <div className="flex flex-col gap-1 mt-1">
                          <p className="text-text-primary transition-colors">{step}</p>
                       </div>
                    </li>
                  ))}
               </ol>
            </div>
         </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 pt-12 border-t border-borderColor">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
               <MessageCircle className="text-primary" />
               Community Reviews
            </h3>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Add Review Form */}
            <div className="lg:col-span-1">
               <form onSubmit={submitReview} className="bg-bg-card border border-borderColor rounded-2xl p-6 sticky top-24 shadow-md">
                  <h4 className="font-bold text-text-primary mb-4">Leave a Review</h4>
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Rating</label>
                        <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map((num) => (
                              <button 
                                key={num}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: num })}
                                className={`transition-colors ${newReview.rating >= num ? 'text-warning' : 'text-gray-300'}`}
                              >
                                 <Star size={24} fill={newReview.rating >= num ? 'currentColor' : 'none'} />
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Your Experience</label>
                        <textarea 
                           className="p-4 bg-bg-main border border-borderColor rounded-xl focus:outline-none focus:border-primary resize-none text-sm transition-colors"
                           placeholder="What did you think about this recipe?"
                           rows="4"
                           required
                           value={newReview.comment}
                           onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        ></textarea>
                     </div>
                     <button className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                        <Send size={18} />
                        Post Review
                     </button>
                  </div>
               </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
               {reviews.length > 0 ? (
                  reviews.map((rev) => (
                     <div key={rev._id} className="bg-bg-card border border-borderColor rounded-2xl p-6 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary border border-primary-light overflow-hidden">
                                 {rev.user?.avatar ? <img src={`http://localhost:5000${rev.user.avatar}`} className="w-full h-full object-cover" /> : <Star size={20} />}
                              </div>
                              <div>
                                 <p className="font-bold text-text-primary text-sm">{rev.user?.username || 'Gourmet Lover'}</p>
                                 <p className="text-[10px] text-text-muted font-medium">{new Date(rev.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex gap-0.5 text-warning bg-warning-light/10 px-2 py-1 rounded-lg">
                              {Array(rev.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                           </div>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">{rev.comment}</p>
                     </div>
                  ))
               ) : (
                  <div className="py-20 text-center bg-bg-card border-2 border-dashed border-borderColor rounded-3xl">
                     <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary mx-auto mb-4 opacity-50">
                        <MessageCircle size={32} />
                     </div>
                     <p className="text-text-secondary font-medium">Be the first to share your experience!</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
