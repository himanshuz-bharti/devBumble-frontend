import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { updateUser } from '../utils/userSlice';

function EditProfile({ user, onEditComplete }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    photourl: '',
    age: '',
    gender: '',
    email: ''
  });
  const dispatch = useDispatch();
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        photourl: user.photourl || '',
        age: user.age || '',
        gender: user.gender || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const enableEditing = () => {
    setIsEditable(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updatedData = {...formData};
      delete updatedData.email;  // Email cannot be changed
      
      const response = await axios.patch(BASE_URL+'/profile/edit',
        updatedData,
        { withCredentials: true }
      );
      console.log("editing",response);
      
      if (response.status === 200) {
        dispatch(updateUser(response.data));
        if (onEditComplete) onEditComplete(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSubmitting(false);
      setIsEditable(false); // Return to non-editable state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      
      {user.photourl && (
        <div className="flex justify-center mb-6">
          <img 
            src={user.photourl} 
            alt={`${user.firstname} ${user.lastname}`} 
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      )}
      
      {!isEditable && (
        <div className="text-center mb-6">
          <button
            onClick={enableEditing}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Enable Editing
          </button>
          <p className="text-sm text-gray-500 mt-2">Fields are currently read-only</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Photo URL</label>
          <input
            type="url"
            name="photourl"
            value={formData.photourl}
            onChange={handleChange}
            placeholder="Enter image URL"
            disabled={!isEditable}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isEditable}
          className={`w-full py-2 px-4 rounded-md transition duration-200 
            ${isEditable ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;