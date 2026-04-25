import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye } from 'lucide-react';
import api from '../../api/api';

export default function ManageRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes/chef');
      setRecipes(res.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await api.delete(`/recipes/${id}`);
        setRecipes(recipes.filter(r => r._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete recipe');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-bg-card p-6 rounded-xl border border-borderColor">
         <h3 className="text-xl font-bold text-text-primary">Manage Recipe</h3>
         <button 
           className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
           onClick={() => navigate('/chef/recipes/add')}
         >
           Create Recipe
         </button>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg-main border-b border-borderColor text-text-secondary font-semibold text-sm">
            <tr>
              <th className="py-4 px-6">Recipe</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Ratings</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="py-10 text-center text-text-secondary">Loading recipes...</td></tr>
            ) : recipes.length > 0 ? (
              recipes.map((row) => (
                <tr key={row._id} className="border-b border-borderColor last:border-0 hover:bg-bg-main transition-colors">
                  <td className="py-4 px-6">
                     <p className="font-semibold text-text-primary">{row.title}</p>
                     <p className="text-xs text-text-secondary">By You</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-text-secondary">{row.category}</td>
                  <td className="py-4 px-6 text-sm text-text-secondary">{row.rating}</td>
                  <td className="py-4 px-6">
                     <div className="flex items-center justify-center gap-2">
                       <button 
                         onClick={() => navigate(`/chef/recipe/${row._id}`)}
                         className="p-2 text-text-secondary hover:text-primary bg-primary-light rounded transition-colors"
                       >
                         <Eye size={16} />
                       </button>
                       <button 
                         onClick={() => navigate(`/chef/recipes/edit/${row._id}`)}
                         className="p-2 text-text-secondary hover:text-primary bg-primary-light rounded transition-colors"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(row._id)}
                         className="p-2 text-danger hover:text-white bg-red-50 hover:bg-danger rounded transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="py-10 text-center text-text-secondary">No recipes found. Start by creating one!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
