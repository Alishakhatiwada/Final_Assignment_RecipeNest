import { Routes, Route } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import Home from './Home';
import Explore from './Explore';
import Profile from './Profile';
import EditProfile from './EditProfile';
import ChefList from './ChefList';
import SavedRecipes from './SavedRecipes';
import ViewRecipe from './ViewRecipe';
import ChefProfile from './ChefProfile';
import AccountSettings from './AccountSettings';
import Notifications from './Notifications';
import PrivacySettings from './PrivacySettings';
import Messages from './Messages';
import { useAuth } from '../../context/AuthContext';

export default function UserLayout() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-sm">RecipeNest Loading</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-sans">
      <UserNavbar />
      <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="saved" element={<SavedRecipes />} />
          <Route path="recipe/:id" element={<ViewRecipe />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="chefs" element={<ChefList />} />
          <Route path="chef/:id" element={<ChefProfile />} />
          <Route path="settings/account" element={<AccountSettings />} />
          <Route path="settings/notifications" element={<Notifications />} />
          <Route path="settings/privacy" element={<PrivacySettings />} />
          <Route path="messages" element={<Messages />} />
        </Routes>
      </div>
    </div>
  );
}
