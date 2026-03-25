import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';

export default function ManageMessages() {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);

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

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error('Error deleting message', error);
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
          <Card key={message.id} className={`rounded-2xl shadow-sm border-0 transition-all ${message.status === 'unread' ? 'ring-2 ring-sun/30' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${message.status === 'unread' ? 'bg-sun/20' : 'bg-sky/10'}`}>
                  <Mail className={`w-5 h-5 ${message.status === 'unread' ? 'text-sunset-dark' : 'text-ocean'}`} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-ocean">{message.fullName}</CardTitle>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${message.status === 'unread' ? 'bg-sun/20 text-sunset-dark' : 'bg-gray-100 text-gray-500'}`}>
                  {message.status}
                </span>
                {message.status === 'unread' && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(message.id)} className="text-xs text-ocean hover:bg-sky/10">
                    Mark Read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deleteMessage(message.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-wave" />
                  {message.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-bold mr-2">Subject:</span>
                  {message.subject}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-bold mr-2">Activity:</span>
                  {message.activity}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 italic">
                "{message.message}"
              </div>
              <div className="mt-4 flex justify-end">
                <a 
                  href={`https://wa.me/${message.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-bold text-ocean hover:underline"
                >
                  Reply on WhatsApp
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
    </div>
  );
}
