import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // For simplicity, using email prefix as username
      const username = email.split('@')[0];
      const res = await register({ email, password, username, role });
      if (res.user.role === 'chef') navigate('/chef');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Branding Panel */}
      <div className="flex-1 bg-bg-main flex flex-col justify-center p-12 lg:p-24 border-r border-borderColor">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-2xl text-white">
             🍲
           </div>
           <div>
             <h1 className="text-2xl font-bold text-text-primary">RecipeNest</h1>
             <p className="text-text-secondary text-sm">Your culinary companion</p>
           </div>
        </div>
        
        <div className="mt-8 max-w-[400px] flex flex-col gap-6">
           <div>
             <h3 className="text-lg font-semibold text-text-primary mb-1">Browse Thousands of Recipes</h3>
             <p className="text-sm text-text-secondary">Discover recipes from cuisines around the world.</p>
           </div>
           
           <div>
             <h3 className="text-lg font-semibold text-text-primary mb-1">Join the Community</h3>
             <p className="text-sm text-text-secondary">Share your recipes and connect food lovers.</p>
           </div>
           
           <div>
             <h3 className="text-lg font-semibold text-text-primary mb-1">Save Your Favorites</h3>
             <p className="text-sm text-text-secondary">Build your personal cookbook with recipes you love.</p>
           </div>
        </div>
      </div>

      {/* Right Register Form */}
      <div className="flex-1 bg-bg-card flex items-center justify-center p-12">
        <div className="w-full max-w-[400px] flex flex-col">
          <h2 className="text-3xl font-bold text-text-primary">Create Account</h2>
          <p className="text-text-secondary mt-1 mb-8">Join RecipeNest to start your culinary journey.</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Join As</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary focus:bg-bg-card transition-colors cursor-pointer"
              >
                <option value="user">Food Enthusiast (User)</option>
                <option value="chef">Professional Chef</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input 
                type="email" 
                placeholder="user@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary focus:bg-bg-card transition-colors"
                required 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Password</label>
              <input 
                type="password" 
                placeholder="Enter Your Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-bg-main border border-borderColor rounded-lg focus:outline-none focus:border-primary focus:bg-bg-card transition-colors"
                required 
              />
            </div>

            <button type="submit" className="w-full py-3 mt-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors">
              Create account
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-text-secondary">
            Already have an account? 
            <Link to="/login" className="text-primary font-semibold hover:underline ml-1">Sign In</Link>
          </div>
          
          <div className="text-center mt-8">
             <Link to="/" className="text-sm text-text-secondary inline-flex items-center justify-center gap-1 hover:text-text-primary transition-colors">
                &larr; Back
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
