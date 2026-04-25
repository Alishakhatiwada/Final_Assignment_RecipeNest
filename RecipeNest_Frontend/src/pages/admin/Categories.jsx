import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Apple, Pizza, CakeSlice, Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch categories error:', err);
      toast.error('Failed to load culinary categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    const title = window.prompt("Enter new category name (e.g., Italian, Breakfast, Spicy):");
    if (title) {
      try {
        const res = await api.post('/categories', { title });
        setCategories([...categories, res.data]);
        toast.success(`'${title}' added to the library`);
      } catch (err) {
        toast.error('Failed to create category');
      }
    }
  };

  const handleDeleteCategory = async (e, id, title) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove the '${title}' category?`)) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(cat => cat._id !== id));
        toast.success('Category purged');
      } catch (err) {
        toast.error('Failed to remove category');
      }
    }
  };

  const handleEditCategory = async (e, id, currentTitle) => {
    e.stopPropagation();
    const newTitle = window.prompt("Edit category name:", currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      try {
        const res = await api.put(`/categories/${id}`, { title: newTitle });
        setCategories(categories.map(cat => cat._id === id ? res.data : cat));
        toast.success(`Category updated to '${newTitle}'`);
      } catch (err) {
        toast.error('Failed to update category');
      }
    }
  };

  // Map of icons for variety
  const icons = [Coffee, Apple, Pizza, CakeSlice];

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl border border-borderColor shadow-sm">
        <div>
           <h2 className="text-3xl font-black text-text-primary uppercase italic tracking-tighter">Culinary Taxonomy</h2>
           <p className="text-xs text-text-secondary font-medium tracking-wide">Organize the world's recipes by flavor and tradition</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-black uppercase italic tracking-widest text-xs transition-all shadow-lg hover:shadow-primary/40 flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
           <div className="col-span-full py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="text-xs font-black uppercase italic tracking-widest text-text-secondary">Indexing Categories...</p>
           </div>
        ) : categories.length > 0 ? (
          categories.map((cat, idx) => {
            const CatIcon = icons[idx % icons.length];
            return (
              <div 
                key={cat._id} 
                className="bg-white group border border-borderColor rounded-3xl p-10 flex flex-col items-center gap-6 hover:border-primary hover:shadow-2xl transition-all relative overflow-hidden"
              >
                 {/* Decorative background element */}
                 <div className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                    <CatIcon size={120} />
                 </div>

                 <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button onClick={(e) => handleEditCategory(e, cat._id, cat.title)} className="bg-primary-light p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                    <button onClick={(e) => handleDeleteCategory(e, cat._id, cat.title)} className="bg-red-50 p-2 rounded-lg text-danger hover:bg-danger hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                 </div>

                 <div className="relative text-primary p-6 bg-primary-light rounded-[2.5rem] group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden shadow-inner">
                   <CatIcon size={40} className="relative z-10" />
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 </div>
                 
                 <div className="text-center">
                    <h3 className="font-black text-text-primary text-xl uppercase italic group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">Manage Category</p>
                 </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center border-4 border-dashed border-borderColor rounded-[3rem] bg-bg-main/20">
             <p className="text-xl font-black text-text-secondary uppercase italic tracking-tighter">"The pantry is empty."</p>
             <p className="text-sm font-medium text-text-muted mt-2">Start by adding your first culinary category above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
