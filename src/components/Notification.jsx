import React, { useState, useEffect } from 'react';

export default function Notification({ message, type }) {
  const [visible, setVisible] = useState(true);
  
  // Reset visibility when component mounts
  useEffect(() => {
    setVisible(true);
    
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Auto-dismiss after 3 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded-md shadow-md transition-opacity duration-300 flex items-center
      ${type === 'success' ? 'bg-green-500 bg-opacity-90 text-white' : 'bg-red-500 bg-opacity-90 text-white'}`}>
      <div className="font-medium">{message}</div>
    </div>
  );
}