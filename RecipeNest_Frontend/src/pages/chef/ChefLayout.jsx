import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Dashboard from './Dashboard';
import ManageRecipes from './ManageRecipes';
import AddRecipe from './AddRecipe';
import ReviewModeration from './ReviewModeration';
import Analytics from './Analytics';
import ProfileSettings from './ProfileSettings';
import EditChefProfile from './EditChefProfile';
import ChefViewRecipe from './ChefViewRecipe';
import EditRecipe from './EditRecipe';
import ChefMessages from './ChefMessages';
import ChefNotifications from './ChefNotifications';
import { useAuth } from '../../context/AuthContext';

export default function ChefLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-sm">Chef Portal Loading</p>
    </div>
  );
  if (!user || user.role !== 'chef') return <Navigate to="/login" />;
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/chef', exact: true, icon: 'LayoutDashboard' },
    { label: 'My Recipe', path: '/chef/recipes', exact: false, icon: 'BookOpen' },
    { label: 'Reviews', path: '/chef/reviews', exact: false, icon: 'Star' },
    { label: 'Analytics', path: '/chef/analytics', exact: false, icon: 'PieChart' },
    { label: 'Profile', path: '/chef/profile', exact: false, icon: 'Settings' }
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/chef': return 'My Dashboard';
      case '/chef/recipes': return 'Manage Recipe';
      case '/chef/reviews': return 'Review Moderation';
      case '/chef/analytics': return 'Analytics';
      case '/chef/profile': return 'Profile Settings';
      default:
        if (location.pathname.includes('/chef/recipes/add')) return 'Create New Recipe';
        return 'Chef Portal';
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-main font-sans">
      <Sidebar 
        title="ChefPortal" 
        subtitle="Professional Dashboard" 
        items={sidebarItems} 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar 
          title={getPageTitle()}
          username={user.username}
          avatar={user.avatar ? `http://localhost:5000${user.avatar}` : null}
          role={user.role === 'chef' ? 'Professional Chef' : 'Chef'}
          messageLink="/chef/messages"
          notificationLink="/chef/notifications"
        />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="recipes" element={<ManageRecipes />} />
            <Route path="recipes/add" element={<AddRecipe />} />
            <Route path="recipes/edit/:id" element={<EditRecipe />} />
            <Route path="recipe/:id" element={<ChefViewRecipe />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="profile/edit" element={<EditChefProfile />} />
            <Route path="messages" element={<ChefMessages />} />
            <Route path="notifications" element={<ChefNotifications />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
