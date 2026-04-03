import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Calendar, Trash2, MessageCircle } from 'lucide-react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function ManageMessages() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const fetchMessages = () => {
    fetch('/api/contact', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const confirmDeleteMessage = (id: string) => {
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      const res = await fetch(`/api/contact/${messageToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
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
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'read' }),
      });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-ocean mb-8">{t('admin_manage_messages')}</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {messages.map((message) => (
          <Card key={message.id} className={`rounded-[2rem] shadow-sm border-0 transition-transform hover:-translate-y-1 hover:shadow-md overflow-hidden bg-white ${message.status === 'unread' ? 'border-t-8 border-t-sun ring-1 ring-sun/20' : 'border-t-8 border-t-sky ring-1 ring-gray-100'}`}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 pt-6 px-5 sm:px-8 bg-gradient-to-b from-gray-50/50">
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
                      {t('admin_mark_read')}
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
            <CardContent className="px-5 sm:px-8 pt-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <a 
                  href={`https://wa.me/${message.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer uppercase tracking-widest"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('admin_reply_whatsapp')}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('admin_no_messages_found')}</p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDeleteMessage}
        title={t('delete_title')}
        message={t('delete_message')}
      />
    </div>
  );
}
