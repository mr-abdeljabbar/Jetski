import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ManageActivities() {
  const { token } = useAuthStore();
  const [activities, setActivities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchActivities = () => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      // Basic implementation: 1 duration and 1 image for now
      const activityData = {
        ...data,
        durations: [{ durationLabel: '1 hour', price: parseFloat(data.price) }],
        images: [{ imageUrl: 'https://images.unsplash.com/photo-1558604446-0b1d30f40212?auto=format&fit=crop&q=80&w=1000' }],
      };

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        reset();
        fetchActivities();
      }
    } catch (error) {
      console.error('Error adding activity', error);
    }
  };

  const deleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchActivities();
      }
    } catch (error) {
      console.error('Error deleting activity', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-ocean">Manage Activities</h1>
        <Button variant="secondary" className="rounded-xl" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" /> Add Activity
        </Button>
      </div>
      
      <Card className="rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Max Persons</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                      <img src={activity.images[0]?.imageUrl} alt={activity.title} className="w-10 h-10 rounded-md object-cover mr-3" />
                      {activity.title}
                    </td>
                    <td className="px-6 py-4">{activity.category}</td>
                    <td className="px-6 py-4">{activity.maxPersons}</td>
                    <td className="px-6 py-4">{activity.location}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <Button size="sm" variant="outline" className="text-ocean border-sky/30 hover:bg-sky/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteActivity(activity.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-ocean mb-6">Add New Activity</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input {...register('title', { required: true })} placeholder="e.g. Jet Ski Safari" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Input {...register('category', { required: true })} placeholder="e.g. Jet Ski" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                  <Input type="number" {...register('price', { required: true })} placeholder="50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Persons</label>
                  <Input type="number" {...register('maxPersons', { required: true })} placeholder="2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input {...register('location', { required: true })} placeholder="Taghazout Beach" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Safety Information</label>
                  <Input {...register('safetyInfo', { required: true })} placeholder="e.g. Life jacket provided" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Included</label>
                  <Input {...register('equipmentIncluded', { required: true })} placeholder="e.g. Jet Ski, Life Jacket" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  {...register('description', { required: true })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean min-h-[100px]"
                ></textarea>
              </div>
              <Button variant="secondary" type="submit" className="w-full rounded-xl py-6 mt-4">
                Create Activity
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
