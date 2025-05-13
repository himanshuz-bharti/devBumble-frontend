import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(store => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + '/profile/view', {
        withCredentials: true,
      });
      console.log('fetch', res.data);
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.status == 401) {
        navigate('/login');
      } else console.error(error.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Body;