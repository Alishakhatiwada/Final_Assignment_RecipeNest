import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ id, image, title, chef, rating, time, basePath }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(basePath ? `${basePath}${id || 1}` : `/user/recipe/${id || 1}`)}
      className="bg-bg-card rounded-xl overflow-hidden shadow-sm border border-borderColor hover:-translate-y-1 hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer"
    >
      <div className="h-[180px] w-full bg-primary-light flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-primary font-bold opacity-50">Image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[1.1rem] text-text-primary mb-1 whitespace-nowrap overflow-hidden text-ellipsis font-bold">{title}</h3>
        <p className="text-[0.85rem] text-text-secondary mb-2">By {chef}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-[0.85rem] text-text-primary font-medium">
            <Star size={16} fill="var(--color-warning)" className="text-warning" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[0.85rem] text-text-secondary font-medium">
            <Clock size={16} />
            <span>{time} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
