import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Branding Panel */}
      <div className="flex-1 bg-bg-main flex flex-col items-center justify-center p-12 text-center border-r border-borderColor">
        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-4xl text-white mb-8">
          🍲
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">RecipeNest</h1>
        <p className="text-text-secondary text-lg max-w-[400px] leading-relaxed">
          Discover & Share Delicious Recipes
        </p>
        <p className="mt-4 text-base text-text-secondary max-w-[400px]">
          Join thousands of home cooks and professional chefs sharing their favorite recipes, cooking tips, and culinary adventures.
        </p>

        <div className="mt-auto pt-16 flex flex-col gap-4 items-start w-full max-w-[400px]">
          <div className="flex items-center justify-between w-full text-text-secondary text-sm">
            <span>Are you a chef?</span>
            <Link to="/login" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              Access Chef Portal <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex items-center justify-between w-full text-text-secondary text-sm">
            <span>Are you an admin?</span>
            <Link to="/login" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              Access Admin Portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 bg-bg-main flex items-center justify-center p-12">
         <div className="w-full max-w-[400px] bg-bg-card p-8 rounded-xl border border-borderColor shadow-lg text-center flex flex-col items-center">
            <div className="w-[60px] h-[60px] bg-primary-light text-primary text-3xl mb-6 flex items-center justify-center rounded-xl">
              🍳
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Discover Recipes</h2>
            <p className="text-text-secondary mt-2 mb-8">Browse thousands of recipes from cuisines around the world.</p>
            <div className="flex gap-4 justify-center w-full">
              <button 
                className="flex-1 py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors" 
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
              <button 
                className="flex-1 py-2 px-4 border border-primary text-primary font-medium rounded-lg hover:bg-primary-light transition-colors" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
