import { Shield } from 'lucide-react';

export default function PrivacySettings() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Privacy and Settings</h1>
        <p className="text-text-secondary">Manage your privacy preferences.</p>
      </div>

      <div className="bg-bg-card border border-borderColor rounded-xl p-8 flex flex-col items-center justify-center text-center mt-6">
         <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary mb-4">
            <Shield size={28} />
         </div>
         <h2 className="text-xl font-bold text-text-primary mb-2">Privacy Controls Coming Soon</h2>
         <p className="text-text-secondary max-w-md">
            Options to manage your profile visibility, data sharing, and other privacy settings will be available in the near future.
         </p>
      </div>
    </div>
  );
}
