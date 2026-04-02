import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Edit, Trash2, X, Users, MapPin, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function ManageActivities() {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchActivities = () => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openEditModal = (activity: any) => {
    setEditingActivity(activity);
    setImagePreview(activity.images[0]?.imageUrl || null);
    setSelectedImage(null);
    setValue('title', activity.title);
    setValue('slug', activity.slug);
    setValue('category', activity.category);
    setValue('price', activity.durations[0]?.price || '');
    setValue('maxPersons', activity.maxPersons);
    setValue('location', activity.location);
    setValue('safetyInfo', activity.safetyInfo);
    setValue('equipmentIncluded', activity.equipmentIncluded);
    setValue('description', activity.description);
    setValue('rating', activity.rating || 5.0);
    setValue('backgroundImageUrl', activity.backgroundImageUrl || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    setImagePreview(null);
    setSelectedImage(null);
    setIsUploading(false);
    reset();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      let imageUrl = editingActivity?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558604446-0b1d30f40212?auto=format&fit=crop&q=80&w=1000';

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          console.error('Failed to upload image');
          setIsUploading(false);
          return;
        }
      }

      const activityData = {
        ...data,
        durations: [{ durationLabel: '1 hour', price: parseFloat(data.price) }],
        images: [{ imageUrl }],
        backgroundImageUrl: data.backgroundImageUrl,
      };

      const url = editingActivity ? `/api/activities/${editingActivity.id}` : '/api/activities';
      const method = editingActivity ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(activityData),
      });

      if (res.ok) {
        closeModal();
        fetchActivities();
      } else {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error saving activity', error);
      setIsUploading(false);
    }
  };

  const confirmDeleteActivity = (id: string) => {
    setActivityToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDeleteActivity = async () => {
    if (!activityToDelete) return;
    try {
      const res = await fetch(`/api/activities/${activityToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        fetchActivities();
      }
    } catch (error) {
      console.error('Error deleting activity', error);
    } finally {
      setDeleteModalOpen(false);
      setActivityToDelete(null);
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="rounded-3xl shadow-sm border-0 transition-transform hover:-translate-y-1 hover:shadow-md overflow-hidden bg-white border-t-8 border-t-ocean">
            <div className="h-48 relative">
              <img 
                src={activity.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1558604446-0b1d30f40212?auto=format&fit=crop&q=80&w=1000'} 
                alt={activity.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <span className="font-black text-ocean">€{activity.durations[0]?.price || '0'}</span>
              </div>
            </div>
            
            <CardHeader className="pb-2 pt-5">
              <CardTitle className="text-xl font-black text-gray-900">{activity.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                    <Tag className="w-4 h-4 text-sky" />
                  </div>
                  {activity.category}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                    <Users className="w-4 h-4 text-ocean" />
                  </div>
                  Max {activity.maxPersons} Person(s)
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                    <MapPin className="w-4 h-4 text-sun" />
                  </div>
                  <span className="truncate">{activity.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Button 
                  onClick={() => openEditModal(activity)} 
                  className="flex-1 bg-sky/10 text-ocean hover:bg-sky/20 font-bold rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  onClick={() => confirmDeleteActivity(activity.id)} 
                  className="flex-none bg-red-50 text-red-600 hover:bg-red-100 rounded-xl px-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-ocean mb-6">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="activity-title" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Activity Title</label>
                  <Input 
                    id="activity-title"
                    {...register('title', { required: true })} 
                    placeholder="e.g. Jet Ski Rental" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="activity-slug" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Slug (URL)</label>
                  <Input 
                    id="activity-slug"
                    {...register('slug', { required: true })} 
                    placeholder="e.g. jet-ski-rental" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="activity-category" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Category</label>
                  <Input 
                    id="activity-category"
                    {...register('category', { required: true })} 
                    placeholder="e.g. Jet Ski" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
                <div className="space-y-2">
                <label htmlFor="activity-price" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Price (MAD)</label>
                <Input 
                  id="activity-price"
                  type="number" 
                  {...register('price', { required: true, valueAsNumber: true })} 
                  placeholder="e.g. 500" 
                  className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                />
              </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="activity-max-persons" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Max Persons</label>
                  <Input 
                    id="activity-max-persons"
                    type="number" 
                    {...register('maxPersons', { required: true, valueAsNumber: true })} 
                    placeholder="e.g. 2" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="activity-location" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Location</label>
                  <Input 
                    id="activity-location"
                    {...register('location', { required: true })} 
                    placeholder="e.g. Taghazout Beach" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="activity-safety-info" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Safety Information</label>
                  <Input 
                    id="activity-safety-info"
                    {...register('safetyInfo', { required: true })} 
                    placeholder="e.g. Life jacket provided" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="activity-rating" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Rating (1-5)</label>
                  <Input 
                    id="activity-rating"
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="5" 
                    {...register('rating', { required: true, valueAsNumber: true })} 
                    placeholder="e.g. 5.0" 
                    className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="activity-equipment" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Equipment Included</label>
                <Input 
                  id="activity-equipment"
                  {...register('equipmentIncluded', { required: true })} 
                  placeholder="e.g. Jet Ski, Life Jacket" 
                  className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="activity-head-image" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Header Background Image URL</label>
                <Input 
                  id="activity-head-image"
                  {...register('backgroundImageUrl')} 
                  placeholder="e.g. /images/activities/activity_background.png" 
                  className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">Leave empty to use a default background.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 text-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full h-48 mb-4">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <button 
                          type="button" 
                          onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600 justify-center mt-2">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-ocean hover:text-sky focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ocean">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="activity-description" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Description</label>
                <textarea
                  id="activity-description"
                  {...register('description', { required: true })}
                  className="w-full bg-paper border-0 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-coral transition-all min-h-[100px]"
                  placeholder="Activity details..."
                ></textarea>
              </div>
              <Button variant="secondary" type="submit" className="w-full rounded-xl py-6 mt-4" disabled={isUploading}>
                {isUploading ? 'Saving...' : editingActivity ? 'Update Activity' : 'Create Activity'}
              </Button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDeleteActivity}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? All associated bookings will be automatically removed."
      />
    </div>
  );
}
