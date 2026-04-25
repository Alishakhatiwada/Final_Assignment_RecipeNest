import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Loader2, MessageSquare, Star } from 'lucide-react';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/chef');
        setReviews(res.data);
      } catch (err) {
        console.error('Error fetching chef reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-bg-card p-6 rounded-xl border border-borderColor">
         <h2 className="text-xl font-bold text-text-primary">Review Moderation</h2>
         <p className="text-sm text-text-secondary mt-1">Review what people think of your recipes.</p>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl overflow-hidden">
         <table className="w-full text-left">
          <thead className="bg-bg-main border-b border-borderColor text-text-secondary font-semibold text-sm">
            <tr>
              <th className="py-4 px-6">Recipe</th>
              <th className="py-4 px-6">Reviewer</th>
              <th className="py-4 px-6">Comments</th>
              <th className="py-4 px-6">Ratings</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <span className="text-xs font-black uppercase italic text-text-secondary">Syncing Feedback...</span>
                  </div>
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((row, idx) => (
                <tr key={row._id} className="border-b border-borderColor last:border-0 hover:bg-bg-main transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-text-primary">{row.recipe?.title}</td>
                  <td className="py-4 px-6 text-sm text-text-secondary">{row.user?.username}</td>
                  <td className="py-4 px-6 text-sm text-text-secondary truncate max-w-[200px]" title={row.comment}>{row.comment}</td>
                  <td className="py-4 px-6 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-warning fill-warning" />
                      <span>{row.rating}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <MessageSquare size={32} className="opacity-20" />
                    <span className="text-sm italic font-medium">No reviews found for your recipes yet.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
