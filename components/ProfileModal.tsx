import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { CloseIcon, UserAvatar, userAvatarMap } from './Icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUserProfile, onSave }) => {
  const [name, setName] = useState(currentUserProfile.name);
  const [selectedIconId, setSelectedIconId] = useState(currentUserProfile.iconId);

  useEffect(() => {
    if (isOpen) {
      setName(currentUserProfile.name);
      setSelectedIconId(currentUserProfile.iconId);
    }
  }, [isOpen, currentUserProfile]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ name: name.trim() || 'You', iconId: selectedIconId });
  };
  
  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-md shadow-xl border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-bold text-white">Edit Your Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 space-y-6">
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                </label>
                <input
                    type="text"
                    id="displayName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter your name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose Your Avatar
                </label>
                <div className="grid grid-cols-5 gap-4">
                    {Object.keys(userAvatarMap).map(iconId => (
                        <button
                            key={iconId}
                            onClick={() => setSelectedIconId(iconId)}
                            className={`p-2 rounded-full transition-all duration-200 ${
                                selectedIconId === iconId 
                                ? 'bg-pink-600 ring-2 ring-pink-400 ring-offset-2 ring-offset-gray-800' 
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            aria-label={`Select avatar ${iconId}`}
                        >
                            <UserAvatar iconId={iconId} className="w-8 h-8 text-white" />
                        </button>
                    ))}
                </div>
            </div>
        </main>
        <footer className="flex justify-end items-center gap-3 p-4 bg-gray-800/50 border-t border-gray-700">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
            >
                Save Changes
            </button>
        </footer>
      </div>
    </div>
  );
};
