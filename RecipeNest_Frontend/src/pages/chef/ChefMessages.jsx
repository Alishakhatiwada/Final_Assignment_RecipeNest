import MessagingSystem from '../../components/MessagingSystem';
import { useLocation } from 'react-router-dom';

export default function ChefMessages() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const contactId = params.get('contact');

  return (
    <div className="max-w-6xl">
      <div className="mb-8 bg-white p-6 rounded-2xl border border-borderColor shadow-sm">
         <h1 className="text-3xl font-black text-text-primary uppercase italic tracking-tight">Professional Inbox</h1>
         <p className="text-sm font-medium text-text-secondary">Respond to student inquiries and gourmet requests.</p>
      </div>
      <MessagingSystem initialContactId={contactId} />
    </div>
  );
}
