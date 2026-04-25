import { NavLink, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserNavbar() {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/user' },
    { name: 'Explore', path: '/user/explore' },
    { name: 'Saved', path: '/user/saved' },
    { name: 'Chef', path: '/user/chefs' },
    { name: 'Messages', path: '/user/messages' },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-bg-card border-b border-borderColor sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">
          🍲
        </div>
        <span className="font-bold text-lg text-primary">RecipeNest</span>
      </div>

      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            end={link.path === '/user'}
            className={({ isActive }) => 
              `font-medium text-sm transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-text-secondary'}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/user/profile" className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors group">
          <div className="text-right hidden sm:block">
             <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{user?.fullName || user?.username || 'Guest'}</p>
             <p className="text-[10px] text-text-muted capitalize">{user?.role || 'Visitor'}</p>
          </div>
          <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-primary">
            {user?.avatar ? <img src={`http://localhost:5000${user.avatar}`} className="w-full h-full object-cover" /> : <User size={20} />}
          </div>
        </Link>
      </div>
    </nav>
  );
}
