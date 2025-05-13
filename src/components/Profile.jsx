import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EditProfile from './EditProfile';
import Notification from './Notification';

// User Card Component
function UserCard({ user, onEditClick }) {
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        {user.photourl ? (
          <img 
            src={user.photourl} 
            alt={`${user.firstname} ${user.lastname}`} 
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-600">
              {user.firstname && user.firstname[0]}
              {user.lastname && user.lastname[0]}
            </span>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-center">
          {user.firstname} {user.lastname}
        </h2>
        
        <p className="text-gray-600 mt-1">{user.email}</p>
        
        <div className="mt-3 text-center">
          {user.age && <p className="text-gray-700">Age: {user.age}</p>}
          {user.gender && <p className="text-gray-700">Gender: {user.gender}</p>}
        </div>
        
        <button
          onClick={onEditClick}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Want to edit your profile?
        </button>
      </div>
    </div>
  );
}

// Main Profile Component
export default function Profile() {
  const user = useSelector(store => store.user);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleEditComplete = (success) => {
    setIsEditing(false);
    if (success) {
      // Reset notification first (if there was one)
      setNotification(null);
      
      // Use setTimeout to ensure state updates before showing new notification
      setTimeout(() => {
        setNotificationKey(prevKey => prevKey + 1);
        setNotification({
          message: 'Profile updated successfully!',
          type: 'success'
        });
      }, 100);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <Notification 
          key={notificationKey}
          message={notification.message} 
          type={notification.type} 
        />
      )}
      
      {isEditing ? (
        <div>
          <EditProfile user={user} onEditComplete={handleEditComplete} />
          <div className="text-center mt-4">
            <button 
              onClick={() => setIsEditing(false)}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <UserCard user={user} onEditClick={handleEditClick} />
      )}
    </div>
  );
}