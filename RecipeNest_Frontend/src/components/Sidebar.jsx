import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function Sidebar({ title = "RecipeNest", subtitle, items = [] }) {
  return (
    <aside className="w-[250px] bg-bg-sidebar border-r border-borderColor flex flex-col h-screen sticky top-0 font-sans">
      <div className="p-8 border-b border-borderColor">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-md flex items-center justify-center text-xl">
            🍲
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary leading-none">{title}</h2>
            {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
      
      <nav className="py-4 flex flex-col flex-1 overflow-y-auto">
        {items.map((item, index) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `flex items-center gap-4 px-8 py-3 font-medium transition-colors border-l-4 ${
                  isActive 
                    ? 'bg-primary-light text-primary border-primary' 
                    : 'text-text-secondary border-transparent hover:bg-bg-main hover:text-primary'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
