import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RecipeCard from '../../components/RecipeCard';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (user && user.savedRecipes) {
        try {
          // Ideally the backend would return populated savedRecipes, 
          // but if it's just IDs we might need a separate call or update the backend.
          // Let's assume for now we might need to fetch them if not populated.
          const res = await api.get('/auth/me'); // This should return populated savedRecipes if we updated the backend to do so
          if (res.data.savedRecipes) {
             // If they are just strings (IDs), we'd need to fetch each or use a $in query
             // Let's assume the backend 'getMe' can populate them.
             setSavedRecipes(res.data.savedRecipes);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary rounded-t-2xl h-[120px] w-full"></div>
      
      <div className="bg-bg-card border border-borderColor rounded-b-2xl p-6 md:p-8 -mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-bg-main shadow-sm text-4xl text-primary overflow-hidden">
               {user.avatar ? <img src={`http://localhost:5000${user.avatar}`} className="w-full h-full object-cover" /> : '👤'}
            </div>
            <div className="pb-2 text-center md:text-left">
              <h2 className="text-2xl font-bold text-text-primary capitalize">{user.fullName || user.username}</h2>
              {user.bio && <p className="text-sm text-text-secondary mt-1">{user.bio}</p>}
              <p className="text-sm text-text-muted mt-1">
                {user.location && <span className="mr-2">{user.location} •</span>}
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end pb-2">
           <button 
             onClick={() => navigate('/user/profile/edit')}
             className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
           >
              Edit Profile
           </button>
           <button 
             onClick={() => navigate('/user/settings/account')}
             className="bg-bg-main border border-borderColor text-text-secondary p-2 rounded-lg hover:text-primary transition-colors"
           >
              <Settings size={20} />
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        <div className="w-full md:w-[250px] flex flex-col gap-2">
          <button className="text-left px-4 py-3 rounded-lg font-medium text-primary bg-primary-light border-l-4 border-primary">
             Saved Recipe
          </button>
          <button 
            onClick={() => navigate('/user/settings/account')}
            className="text-left px-4 py-3 rounded-lg font-medium text-text-secondary hover:bg-bg-main transition-colors"
          >
             Account Settings
          </button>
          <button 
            onClick={() => navigate('/user/settings/notifications')}
            className="text-left px-4 py-3 rounded-lg font-medium text-text-secondary hover:bg-bg-main transition-colors"
          >
             Notification
          </button>
          <button 
            onClick={() => navigate('/user/settings/privacy')}
            className="text-left px-4 py-3 rounded-lg font-medium text-text-secondary hover:bg-bg-main transition-colors"
          >
             Privacy and Settings
          </button>
          <button 
            onClick={handleLogout}
            className="text-left px-4 py-3 mt-4 rounded-lg font-medium text-danger hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
             <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-text-primary mb-4">Saved Recipes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.length > 0 ? (
              savedRecipes.map((recipe) => (
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
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-text-secondary border-2 border-dashed border-borderColor rounded-2xl">
                {loading ? 'Loading saved recipes...' : 'You haven\'t saved any recipes yet.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
