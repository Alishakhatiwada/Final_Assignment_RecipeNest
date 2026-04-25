import MessagingSystem from '../../components/MessagingSystem';
import { useLocation } from 'react-router-dom';

export default function Messages() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const contactId = params.get('contact');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
         <h1 className="text-3xl font-black text-text-primary uppercase italic tracking-tight">Culinary Inbox</h1>
         <p className="text-text-secondary font-medium">Chat with masters and fellow food enthusiasts.</p>
      </div>
      <MessagingSystem initialContactId={contactId} />
    </div>
  );
}
