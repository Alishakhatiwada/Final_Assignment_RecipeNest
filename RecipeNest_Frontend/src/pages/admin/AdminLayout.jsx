import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import RecipeManagement from './RecipeManagement';
import Categories from './Categories';
import ReviewModeration from './ReviewModeration';
import Analytics from './Analytics';
import Settings from './Settings';
import AdminViewRecipe from './AdminViewRecipe';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-sm">Admin Panel Loading</p>
    </div>
  );
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  
  const sidebarItems = [
    { label: 'Dashboard', path: '/admin', exact: true, icon: 'LayoutDashboard' },
    { label: 'Users & Chefs', path: '/admin/users', exact: false, icon: 'Users' },
    { label: 'Recipe Management', path: '/admin/recipes', exact: false, icon: 'BookOpen' },
    { label: 'Categories', path: '/admin/categories', exact: false, icon: 'LayoutGrid' },
    { label: 'Reviews Moderation', path: '/admin/reviews', exact: false, icon: 'Star' },
    { label: 'Analytics', path: '/admin/analytics', exact: false, icon: 'PieChart' },
    { label: 'Settings', path: '/admin/settings', exact: false, icon: 'Settings' }
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin': return 'Dashboard Overview';
      case '/admin/users': return 'Users & Chefs Management';
      case '/admin/recipes': return 'Recipe Management';
      case '/admin/categories': return 'Category Management';
      case '/admin/reviews': return 'Review Moderation';
      case '/admin/analytics': return 'Analytics';
      case '/admin/settings': return 'Settings';
      default: return 'Admin Panel';
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-main font-sans">
      <Sidebar 
        title="Admin Panel" 
        subtitle="RecipeNest" 
        items={sidebarItems} 
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar 
          title={getPageTitle()}
          username={user.username}
          avatar={user.avatar ? `http://localhost:5000${user.avatar}` : null}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="chefs" element={<Navigate to="/admin/users" replace />} />
            <Route path="recipes" element={<RecipeManagement />} />
            <Route path="recipe/:id" element={<AdminViewRecipe />} />
            <Route path="categories" element={<Categories />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
