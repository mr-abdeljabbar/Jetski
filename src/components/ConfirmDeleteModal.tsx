import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone." 
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl transform scale-100 transition-all duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 ring-8 ring-red-50/50">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-500 mb-8 px-2">{message}</p>
          
          <div className="flex space-x-3 w-full">
            <Button variant="outline" className="flex-1 rounded-xl py-6 border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 rounded-xl py-6 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20" onClick={onConfirm}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
