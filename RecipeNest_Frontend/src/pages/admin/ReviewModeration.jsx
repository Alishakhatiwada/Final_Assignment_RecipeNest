import { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Star, Loader2, User, Book } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Fetch reviews error:', err);
      toast.error('Failed to load platform reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      try {
        await api.delete(`/reviews/${id}`);
        setReviews(reviews.filter(r => r._id !== id));
        toast.success('Review removed from history');
      } catch (err) {
        toast.error('Failed to purge review');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-primary/5">
           <MessageSquare size={120} />
        </div>
        <h2 className="text-3xl font-black text-text-primary uppercase italic tracking-tighter relative z-10">Review Moderation</h2>
        <p className="text-sm text-text-secondary mt-1 font-medium relative z-10">Monitor and maintain the quality of community feedback</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4 bg-white rounded-[2rem] border border-borderColor shadow-inner">
             <Loader2 className="animate-spin text-primary" size={40} />
             <p className="text-xs font-black uppercase italic tracking-widest text-text-secondary">Scanning Community Feedback...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((row) => (
            <div key={row._id} className="bg-white border border-borderColor rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/50 hover:shadow-xl transition-all group">
               <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-3 py-1 bg-primary-light rounded-lg text-primary text-[10px] font-black uppercase tracking-widest italic">
                        <Book size={12} /> {row.recipe?.title || 'Unknown Recipe'}
                     </div>
                     <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                           <Star 
                              key={i} 
                              size={14} 
                              className={i < row.rating ? "fill-warning text-warning" : "text-borderColor"} 
                           />
                        ))}
                     </div>
                  </div>
                  
                  <blockquote className="text-lg font-bold text-text-primary italic border-l-4 border-primary pl-4 py-1 leading-snug">
                     "{row.comment}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                     <span className="flex items-center gap-1.5 bg-bg-main px-3 py-1.5 rounded-full">
                        <User size={12} /> {row.user?.username} ({row.user?.email})
                     </span>
                     <span className="text-text-muted">
                        Published on {new Date(row.createdAt).toLocaleDateString()} at {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                  </div>
               </div>

               <button 
                  onClick={() => handleDelete(row._id)}
                  className="w-12 h-12 rounded-2xl bg-red-50 text-danger hover:bg-danger hover:text-white transition-all flex items-center justify-center shadow-sm group-hover:scale-110 active:scale-90"
                  title="Delete Review"
               >
                  <Trash2 size={20} />
               </button>
            </div>
          ))
        ) : (
          <div className="py-32 text-center border-4 border-dashed border-borderColor rounded-[3rem] bg-bg-main/20">
             <p className="text-xl font-black text-text-secondary uppercase italic tracking-tighter">"The comment section is silent."</p>
             <p className="text-sm font-medium text-text-muted mt-2">No reviews have been reported or flagged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
