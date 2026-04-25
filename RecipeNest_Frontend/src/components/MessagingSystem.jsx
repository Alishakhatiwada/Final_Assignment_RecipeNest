import { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Loader2, Search, ArrowLeft } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MessagingSystem({ initialContactId = null, backPath = '/' }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact._id);
    }
  }, [activeContact]);

  useEffect(scrollToBottom, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
      
      // If we have an initialContactId from URL, try to find or create them
      if (initialContactId) {
        const existing = res.data.find(c => c.contact._id === initialContactId);
        if (existing) {
          setActiveContact(existing.contact);
        } else {
          try {
            const userRes = await api.get(`/auth/user/${initialContactId}`);
            setActiveContact(userRes.data);
          } catch (err) {
            console.error("User fetch error:", err);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId) => {
    setMsgLoading(true);
    try {
      const res = await api.get(`/messages/${contactId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setMsgLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const res = await api.post('/messages', {
        receiverId: activeContact._id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[500px]"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="flex h-[600px] bg-white border border-borderColor rounded-3xl overflow-hidden shadow-xl">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-borderColor flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-6 border-b border-borderColor">
            <h3 className="font-black text-text-primary uppercase italic tracking-tight">Conversations</h3>
         </div>
         <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? conversations.map((conv) => (
               <div 
                  key={conv.contact._id} 
                  onClick={() => setActiveContact(conv.contact)}
                  className={`p-5 border-b border-borderColor cursor-pointer transition-colors flex gap-3 items-center ${activeContact?._id === conv.contact._id ? 'bg-primary/5' : 'hover:bg-bg-main'}`}
               >
                  <div className="w-12 h-12 rounded-full bg-bg-main flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
                     {conv.contact.avatar ? <img src={`http://localhost:5000${conv.contact.avatar}`} className="w-full h-full object-cover" /> : <UserIcon size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="font-bold text-sm text-text-primary truncate">{conv.contact.fullName || conv.contact.username}</p>
                     <p className="text-xs text-text-secondary truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && <div className="w-2 h-2 bg-primary rounded-full"></div>}
               </div>
            )) : (
              <div className="p-10 text-center text-text-muted italic text-xs">No active conversations</div>
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-bg-main/30 ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
        {activeContact ? (
          <>
            <div className="p-4 bg-white border-b border-borderColor flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <button onClick={() => setActiveContact(null)} className="md:hidden p-2 text-text-secondary"><ArrowLeft size={20} /></button>
                  <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center border border-borderColor overflow-hidden">
                    {activeContact.avatar ? <img src={`http://localhost:5000${activeContact.avatar}`} className="w-full h-full object-cover" /> : <UserIcon size={18} />}
                  </div>
                  <div>
                    <p className="font-black text-text-primary text-sm uppercase tracking-tight italic">{activeContact.fullName || activeContact.username}</p>
                    <p className="text-[10px] font-bold text-primary uppercase">{activeContact.role}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
               {messages.map((msg) => (
                 <div key={msg._id} className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === user?._id ? 'bg-primary text-white rounded-br-none' : 'bg-white text-text-primary border border-borderColor rounded-bl-none'}`}>
                       <p className="font-medium leading-relaxed">{msg.content}</p>
                       <p className={`text-[9px] mt-1 opacity-60 ${msg.sender === user?._id ? 'text-right' : ''}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-borderColor flex gap-3">
               <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 p-4 bg-bg-main border border-borderColor rounded-2xl focus:outline-none focus:border-primary text-sm font-bold shadow-inner"
               />
               <button 
                  type="submit"
                  className="bg-primary text-white p-4 rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
               >
                  <Send size={20} />
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
             <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-borderColor flex items-center justify-center text-text-muted mb-6 rotate-6 group-hover:rotate-0 transition-transform">
                <Send size={48} />
             </div>
             <h3 className="text-xl font-black text-text-primary uppercase italic">No Message Selected</h3>
             <p className="text-sm text-text-secondary mt-2 max-w-xs font-medium">Select a conversation from the left to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
