import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Info } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

export default function AddRecipe() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    cookingTime: '',
    servings: ''
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, category: res.data[0].title }));
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e, publishStatus = 'Published') => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.cookingTime) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    ingredients.forEach(ing => ing && data.append('ingredients[]', ing));
    steps.forEach(step => step && data.append('instructions[]', step));
    if (image) data.append('image', image);
    data.append('status', publishStatus);

    try {
      await api.post('/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(publishStatus === 'Published' ? 'Recipe published successfully!' : 'Recipe saved as draft!');
      navigate('/chef/recipes');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-20">
      <div className="bg-white p-10 rounded-[2.5rem] border border-borderColor shadow-xl shadow-primary/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%]"></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black text-text-primary uppercase italic tracking-tight">Create Masterpiece</h2>
            <p className="text-text-secondary mt-1 font-medium">Share your culinary secrets with the world.</p>
         </div>
         <div className="flex gap-4 relative z-10">
            <button 
              type="button"
              onClick={() => handleSubmit(null, 'Reported')}
              disabled={loading}
              className="px-6 py-3 bg-bg-main border border-borderColor text-text-primary hover:border-primary rounded-2xl font-bold transition-all active:scale-95"
            >
               Save as Draft
            </button>
            <button 
              type="button"
              onClick={() => handleSubmit(null, 'Published')}
              disabled={loading}
              className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
            >
               {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus size={20} />}
               Publish Now
            </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
         {/* Main Form Area */}
         <div className="flex-1 flex flex-col gap-10">
            {/* Basic Info Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-md flex flex-col gap-8">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Info size={20}/></div>
                  <h3 className="text-xl font-bold text-text-primary">Essentials</h3>
               </div>
               
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Recipe Title *</label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g. Grandma's Secret Lasagna" 
                    className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-lg font-bold" 
                  />
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">The Story (Description)</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What makes this dish special?" 
                    rows="4" 
                    className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none font-medium text-text-secondary"
                  ></textarea>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Category *</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary cursor-pointer font-bold"
                    >
                      {categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat._id} value={cat.title}>{cat.title}</option>
                        ))
                      ) : (
                        <option value="">No categories available</option>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Difficulty *</label>
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
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Cooking Time *</label>
                    <input 
                      name="cookingTime"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="e.g. 45 mins" 
                      className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary font-bold" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Average Servings</label>
                    <input 
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="e.g. 4 Guests" 
                      className="p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary font-bold" 
                    />
                  </div>
               </div>
            </div>

            {/* Ingredients Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-md flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                     Ingredients
                  </h3>
                  <button 
                    type="button"
                    onClick={addIngredient} 
                    className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                     <Plus size={14} /> Add One
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ingredients.map((ing, idx) => (
                   <div key={idx} className="relative group">
                     <input 
                       type="text" 
                       value={ing}
                       onChange={(e) => updateIngredient(idx, e.target.value)}
                       placeholder="Item & Quantity" 
                       className="p-4 bg-bg-main border border-borderColor rounded-2xl w-full focus:outline-none focus:border-primary focus:bg-white transition-all pr-12 font-medium" 
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

            {/* Instructions Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-md flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                     Culinary Roadmap
                  </h3>
                  <button 
                    type="button"
                    onClick={addStep} 
                    className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                     <Plus size={14} /> Add Step
                  </button>
               </div>
               <div className="flex flex-col gap-8">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-6 items-start group">
                      <div className="w-12 h-12 rounded-[1rem] bg-bg-main border-2 border-primary text-primary flex flex-shrink-0 items-center justify-center font-black text-xl italic group-focus-within:bg-primary group-focus-within:text-white transition-all shadow-sm">
                         {idx + 1}
                      </div>
                      <div className="flex-1 relative">
                         <textarea 
                           value={step}
                           onChange={(e) => updateStep(idx, e.target.value)}
                           placeholder="Walk us through this step..." 
                           rows="3" 
                           className="p-5 bg-bg-main border border-borderColor rounded-2xl w-full resize-none focus:outline-none focus:border-primary focus:bg-white transition-all font-medium pr-12"
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

         {/* Sidebar Area (Image) */}
         <div className="w-full lg:w-[400px]">
            <div className="sticky top-10 flex flex-col gap-8">
               <div className="bg-white p-8 rounded-[2rem] border border-borderColor shadow-lg flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-text-primary text-center">Hero Shot</h3>
                  <div className="relative aspect-square">
                     <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                        id="recipe-image-upload" 
                     />
                     <label 
                        htmlFor="recipe-image-upload"
                        className={`w-full h-full border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${imagePreview ? 'border-primary' : 'border-borderColor hover:border-primary hover:bg-primary/5'}`}
                     >
                        {imagePreview ? (
                           <>
                              <img src={imagePreview} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                 <p className="text-white font-black uppercase tracking-widest text-sm bg-primary/80 px-4 py-2 rounded-lg">Update Photo</p>
                              </div>
                           </>
                        ) : (
                           <div className="flex flex-col items-center p-6 text-center">
                              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm">
                                 <Upload size={32} />
                              </div>
                              <p className="text-sm font-black text-text-primary uppercase tracking-widest">Select Image</p>
                              <p className="text-[10px] text-text-muted mt-2 font-bold px-4 leading-relaxed">High-quality JPG or PNG recommended for best visibility</p>
                           </div>
                        )}
                     </label>
                  </div>
                  {imagePreview && (
                    <button 
                      type="button"
                      onClick={() => {setImage(null); setImagePreview(null);}} 
                      className="text-danger text-xs font-black uppercase tracking-widest hover:underline"
                    >
                       Remove Image
                    </button>
                  )}
               </div>

               <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                  <h4 className="font-black text-primary uppercase italic text-lg mb-2">Pro Tip!</h4>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed">
                     Detailed steps and specific ingredient measurements help other users recreate your masterpiece perfectly. Don't forget a great photo!
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
