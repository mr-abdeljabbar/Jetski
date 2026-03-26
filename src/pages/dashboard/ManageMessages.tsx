import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function ManageMessages() {
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const fetchMessages = () => {
    fetch('/api/contact', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const confirmDeleteMessage = (id: string) => {
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      const res = await fetch(`/api/contact/${messageToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error('Error deleting message', error);
    } finally {
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'read' }),
      });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-ocean mb-8">Contact Messages</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {messages.map((message) => (
          <Card key={message.id} className={`rounded-3xl shadow-sm border-0 transition-transform hover:-translate-y-1 hover:shadow-md overflow-hidden bg-white ${message.status === 'unread' ? 'border-t-8 border-t-sun ring-1 ring-sun/20' : 'border-t-8 border-t-sky ring-1 ring-gray-100'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 bg-gradient-to-b from-gray-50/50">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-sm ${message.status === 'unread' ? 'bg-sun/20 text-sun' : 'bg-sky/10 text-sky'}`}>
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-ocean">{message.fullName}</CardTitle>
                  <div className="text-xs text-gray-500 flex items-center mt-1 font-medium tracking-wide">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${message.status === 'unread' ? 'bg-sun/20 text-sunset-dark' : 'bg-gray-100 text-gray-500'}`}>
                    {message.status}
                  </span>
                  {message.status === 'unread' && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(message.id)} className="text-xs font-bold bg-sky/10 text-ocean hover:bg-sky/20 rounded-full h-8">
                      Mark Read
                    </Button>
                  )}
                  {user?.role === 'ADMIN' && (
                    <Button variant="ghost" size="sm" onClick={() => confirmDeleteMessage(message.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                    <Phone className="w-4 h-4 text-ocean" />
                  </div>
                  {message.phone}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                    <Mail className="w-4 h-4 text-ocean" />
                  </div>
                  <span className="truncate">{message.subject}</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-5 rounded-2xl text-sm text-gray-700 leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <span className="block font-bold text-ocean mb-2">Message:</span>
                "{message.message}"
              </div>
              <div className="mt-4">
                <a 
                  href={`https://wa.me/${message.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center items-center px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-bold rounded-xl transition-colors shadow-sm mt-4 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Reply via WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages yet.</p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDeleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action is permanent."
      />
    </div>
  );
}
