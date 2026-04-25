import { useState, useEffect } from 'react';
import { Eye, Check, X, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import api from '../../api/api';

export default function RecipeManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0, reported: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const recipesRes = await api.get('/recipes');
      setRecipes(recipesRes.data);
      
      const adminStats = await api.get('/admin/stats');
      setStats({
        total: adminStats.data.recipes,
        published: adminStats.data.recipes - adminStats.data.pendingRecipes, // Simplified for now
        pending: adminStats.data.pendingRecipes,
        reported: 0 // Backend doesn't support reported yet
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSearchQuery(cat);
    } else {
      setSearchQuery('');
    }
    fetchData();
  }, [location.search]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/recipes/${id}`, { status: 'Published' });
      setRecipes(recipes.map(r => r._id === id ? { ...r, status: 'Published' } : r));
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/recipes/${id}`, { status: 'Pending' }); // Or maybe rejected? Let's use Pending for unpublish
      setRecipes(recipes.map(r => r._id === id ? { ...r, status: 'Pending' } : r));
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to completely delete this recipe?")) {
      try {
        await api.delete(`/recipes/${id}`);
        setRecipes(recipes.filter(r => r._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.chef?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex gap-4">
         <div className="flex-1 text-center py-4 bg-bg-card border border-borderColor rounded-xl shadow-sm">
           <p className="text-sm font-semibold text-text-primary">Total Recipes</p>
           <p className="text-2xl font-bold text-text-secondary mt-1">{stats.total}</p>
         </div>
         <div className="flex-1 text-center py-4 bg-bg-card border border-borderColor rounded-xl shadow-sm">
           <p className="text-sm font-semibold text-text-primary">Published</p>
           <p className="text-2xl font-bold text-text-secondary mt-1">{stats.published}</p>
         </div>
         <div className="flex-1 text-center py-4 bg-bg-card border border-borderColor rounded-xl shadow-sm">
           <p className="text-sm font-semibold text-text-primary">Pending Reviews</p>
           <p className="text-2xl font-bold text-text-secondary mt-1">{stats.pending}</p>
         </div>
         <div className="flex-1 text-center py-4 bg-bg-card border border-borderColor rounded-xl shadow-sm">
           <p className="text-sm font-semibold text-text-primary">Reported</p>
           <p className="text-2xl font-bold text-text-secondary mt-1">{stats.reported}</p>
         </div>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl overflow-hidden mt-4 pb-6">
         <div className="p-4 border-b border-borderColor flex justify-between items-center bg-bg-main mb-6">
            <h3 className="font-bold text-text-primary">All Recipe</h3>
            <input 
              type="text" 
              placeholder="Search Recipe or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-borderColor bg-white rounded-lg text-sm w-[250px] focus:outline-none focus:border-primary" 
            />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-text-secondary">Loading recipes...</div>
            ) : filteredRecipes.length > 0 ? (
              filteredRecipes.map((r) => (
                <div key={r._id} className="flex flex-col gap-3 relative">
                   <div className={`absolute top-3 left-3 z-10 text-xs font-bold px-2 py-1 rounded
                      ${r.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' : 
                        r.status === 'Published' ? 'bg-green-500 text-white' : 
                        'bg-red-500 text-white'}`}
                   >
                      {r.status}
                   </div>
                   
                   <RecipeCard 
                     id={r._id} 
                     title={r.title}
                     chef={r.chef?.fullName || r.chef?.username || 'Unknown'}
                     rating={r.rating}
                     time={r.cookingTime}
                     image={r.image ? `http://localhost:5000${r.image}` : null}
                     category={r.category}
                     basePath="/admin/recipe/" 
                   />
                   
                   <div className="flex items-center gap-2 mt-2">
                     <button 
                       onClick={() => navigate(`/admin/recipe/${r._id}`)}
                       className="flex-1 flex items-center justify-center gap-1 bg-primary-light text-primary py-2 rounded-lg font-medium text-sm hover:bg-primary hover:text-white transition-colors"
                     >
                        <Eye size={16} /> View
                     </button>
                     
                     {r.status === 'Pending' && (
                       <>
                          <button onClick={() => handleApprove(r._id)} title="Approve & Publish" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"><Check size={18} /></button>
                          <button onClick={() => handleReject(r._id)} title="Reject" className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><X size={18} /></button>
                       </>
                     )}
                     {r.status === 'Published' && (
                       <button onClick={() => handleReject(r._id)} title="Unpublish/Reject" className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><X size={18} /></button>
                     )}
                     {r.status === 'Reported' && (
                       <button onClick={() => handleDelete(r._id)} title="Delete Recipe" className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={18} /></button>
                     )}
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-text-secondary border-2 border-dashed border-borderColor rounded-2xl">
                No recipes found.
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
