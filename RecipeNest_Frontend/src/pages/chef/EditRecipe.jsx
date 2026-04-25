import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Plus, Save } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function EditRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    cookingTime: '',
    servings: ''
  });

  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const r = res.data;
        setFormData({
          title: r.title,
          description: r.description || '',
          category: r.category,
          difficulty: r.difficulty,
          cookingTime: r.cookingTime,
          servings: r.servings || ''
        });
        setIngredients(r.ingredients || []);
        setSteps(r.instructions || []);
        if (r.image) setImagePreview(`http://localhost:5000${r.image}`);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    ingredients.forEach(ing => ing && data.append('ingredients[]', ing));
    steps.forEach(step => step && data.append('instructions[]', step));
    if (image) data.append('image', image);

    try {
      await api.put(`/recipes/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Recipe updated successfully!');
      navigate('/chef/recipes');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-20 flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-text-secondary font-medium">Loading recipe details...</p>
  </div>;

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-20">
      <div className="bg-white p-10 rounded-[2.5rem] border border-borderColor shadow-xl shadow-primary/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%]"></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black text-text-primary uppercase italic tracking-tight">Modify Creation</h2>
            <p className="text-text-secondary mt-1 font-medium">Update your recipe details to keep it fresh.</p>
         </div>
         <div className="flex gap-4 relative z-10">
            <button 
              onClick={() => navigate('/chef/recipes')}
              className="px-6 py-3 bg-bg-main border border-borderColor text-text-primary hover:border-primary rounded-2xl font-bold transition-all"
            >
               Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={updating}
              className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
            >
               {updating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
               Save Changes
            </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
         {/* Main Form Area */}
         <div className="flex-1 flex flex-col gap-10">
            <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-md flex flex-col gap-8">
               <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  General Info
               </h3>
               
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Title</label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    type="text" 
                    className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary font-bold text-lg" 
                  />
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4" 
                    className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary resize-none font-medium"
                  ></textarea>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary font-bold"
                    >
                      {categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat._id} value={cat.title}>{cat.title}</option>
                        ))
                      ) : (
                        <option value={formData.category}>{formData.category || 'Loading...'}</option>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Difficulty</label>
                    <div className="flex gap-2">
                       {['Easy', 'Medium', 'Hard'].map(d => (
                         <button
                           key={d}
                           type="button"
                           onClick={() => setFormData({...formData, difficulty: d})}
                           className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${formData.difficulty === d ? 'bg-primary text-white border-primary shadow-lg' : 'bg-bg-main border-borderColor text-text-secondary hover:border-primary'}`}
                         >
                           {d}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Cook Time</label>
                    <input 
                      name="cookingTime"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      type="text" 
                      className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary font-bold" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Servings</label>
                    <input 
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      type="text" 
                      className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary font-bold" 
                    />
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-md flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                     Ingredients
                  </h3>
                  <button 
                    type="button"
                    onClick={addIngredient} 
                    className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                  >
                     <Plus size={14} /> Add Item
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ingredients.map((ing, idx) => (
                   <div key={idx} className="relative group">
                     <input 
                       type="text" 
                       value={ing}
                       onChange={(e) => updateIngredient(idx, e.target.value)}
                       className="p-4 bg-bg-main border border-borderColor rounded-2xl w-full focus:outline-none focus:border-primary transition-all pr-12 font-medium" 
                     />
                     <button 
                       type="button"
                       onClick={() => removeIngredient(idx)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                        <X size={18} />
                     </button>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-md flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                     Preparation Steps
                  </h3>
                  <button 
                    type="button"
                    onClick={addStep} 
                    className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                  >
                     <Plus size={14} /> Add Step
                  </button>
               </div>
               <div className="flex flex-col gap-8">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-6 items-start group">
                      <div className="w-12 h-12 rounded-[1rem] bg-bg-main border-2 border-primary text-primary flex flex-shrink-0 items-center justify-center font-black text-xl italic transition-all shadow-sm">
                         {idx + 1}
                      </div>
                      <div className="flex-1 relative">
                         <textarea 
                           value={step}
                           onChange={(e) => updateStep(idx, e.target.value)}
                           rows="3" 
                           className="p-5 bg-bg-main border border-borderColor rounded-2xl w-full resize-none focus:outline-none focus:border-primary transition-all font-medium pr-12"
                         ></textarea>
                         <button 
                           type="button"
                           onClick={() => removeStep(idx)}
                           className="absolute right-4 top-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                            <X size={20} />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="w-full lg:w-[400px]">
            <div className="sticky top-10 flex flex-col gap-8">
               <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-lg flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-text-primary text-center">Update Photo</h3>
                  <div className="relative aspect-square">
                     <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                        id="recipe-image-edit" 
                     />
                     <label 
                        htmlFor="recipe-image-edit"
                        className="w-full h-full border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative border-primary"
                     >
                        {imagePreview ? (
                           <>
                              <img src={imagePreview} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-black uppercase tracking-widest text-sm bg-primary/20">
                                 Change Photo
                              </div>
                           </>
                        ) : (
                           <div className="flex flex-col items-center p-6 text-center">
                              <Upload size={32} className="text-primary mb-4" />
                              <p className="text-sm font-black text-text-primary uppercase tracking-widest">Select Image</p>
                           </div>
                        )}
                     </label>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
