import { Bell, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Topbar({ title, username, role, messageLink, notificationLink }) {
  return (
    <header className="h-[70px] bg-bg-card border-b border-borderColor flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
      <div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        {messageLink ? (
          <Link to={messageLink} className="text-text-secondary p-1 rounded-full hover:bg-bg-main hover:text-primary transition-colors block">
            <MessageSquare size={20} />
          </Link>
        ) : (
          <button className="text-text-secondary p-1 rounded-full hover:bg-bg-main hover:text-primary transition-colors">
            <MessageSquare size={20} />
          </button>
        )}
        
        {notificationLink ? (
          <Link to={notificationLink} className="text-text-secondary p-1 rounded-full hover:bg-bg-main hover:text-primary transition-colors block">
            <Bell size={20} />
          </Link>
        ) : (
          <button className="text-text-secondary p-1 rounded-full hover:bg-bg-main hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
        )}
        
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-borderColor cursor-pointer group">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center group-hover:bg-primary-hover transition-colors">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-text-primary">{username}</span>
            {role && <span className="text-xs text-text-muted">{role}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
