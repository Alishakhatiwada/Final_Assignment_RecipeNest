import { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../../components/RecipeCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import api from '../../api/api';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('newest');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const catNames = res.data.map(c => c.title);
        setCategories(['All', ...catNames]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        difficulty,
        sort
      };
      const res = await api.get('/recipes', { params });
      setRecipes(res.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, difficulty, sort]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-text-primary">Explore Cuisines</h2>
           <p className="text-text-secondary mt-1">Discover recipes from around the world</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
           <span className="text-text-muted font-medium">Sort by:</span>
           <select 
             value={sort}
             onChange={(e) => setSort(e.target.value)}
             className="bg-bg-card border border-borderColor rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary cursor-pointer hover:border-primary transition-colors"
           >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
           </select>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat 
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
              : 'bg-bg-card border border-borderColor text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Advanced Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
         <div className="flex-1 w-full bg-white border border-borderColor rounded-xl px-5 py-4 flex items-center gap-3 focus-within:border-primary focus-within:shadow-md transition-all">
            <Search size={22} className="text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by recipe name or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-muted"
            />
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[160px]">
               <select 
                 value={difficulty}
                 onChange={(e) => setDifficulty(e.target.value)}
                 className="w-full bg-bg-card border border-borderColor p-4 rounded-xl text-text-secondary hover:text-primary transition-colors appearance-none focus:outline-none focus:border-primary cursor-pointer"
               >
                  <option value="">Any Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
               </select>
               <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
            </div>
            <button className="bg-primary-light border border-primary-light p-4 rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
               <SlidersHorizontal size={22} />
            </button>
         </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
           {Array(8).fill(0).map((_, i) => (
             <div key={i} className="aspect-[4/5] bg-bg-card border border-borderColor rounded-2xl animate-pulse">
                <div className="w-full h-[60%] bg-bg-main rounded-t-2xl"></div>
                <div className="p-4 flex flex-col gap-3">
                   <div className="h-4 bg-bg-main rounded w-3/4"></div>
                   <div className="h-3 bg-bg-main rounded w-1/2"></div>
                   <div className="flex justify-between mt-2">
                      <div className="h-4 bg-bg-main rounded w-1/4"></div>
                      <div className="h-4 bg-bg-main rounded w-1/4"></div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {recipes.map((recipe) => (
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
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-borderColor rounded-3xl bg-bg-card">
           <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary mb-5 opacity-50">
              <Search size={40} />
           </div>
           <h3 className="text-xl font-bold text-text-primary">No recipes found</h3>
           <p className="text-text-secondary mt-2 max-w-sm">We couldn't find any recipes matching your criteria. Try adjusting your filters or search terms.</p>
           <button 
             onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setDifficulty(''); }}
             className="mt-6 text-primary font-bold hover:underline"
           >
              Clear all filters
           </button>
        </div>
      )}
    </div>
  );
}
