import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addfeed } from '../utils/feedSlice';
import axios from 'axios';
import UserCard from './UserCard';

function Feed() {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [animation, setAnimation] = useState(null);
        
    const handleTick = async (recieverID) => {
      setAnimation('right');
      const res = await axios.post(BASE_URL+`/request/send/interested/${recieverID}`, {}, { withCredentials: true });
      console.log("interested", res.data);
      setTimeout(() => {
        setAnimation(null);
        setCurrentIndex(currentIndex + 1);
      }, 500);
    };
  
    const handleCross = async (recieverID) => {
      setAnimation('left');
      const res =  await axios.post(BASE_URL+`/request/send/ignored/${recieverID}`, {}, { withCredentials: true });
      console.log("ignored", res.data);
      setTimeout(() => {
        setAnimation(null);
        setCurrentIndex(currentIndex + 1);
      }, 500);
    };
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const fetchfeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + '/user/feed', { withCredentials: true });
      console.log("res", res.data.feed);
      dispatch(addfeed(res.data.feed));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchfeed();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      {feed === null ? (
        <p className="text-gray-500">Loading feed...</p>
      ) : feed.length === 0 || currentIndex >= feed.length ? (
        <p className="text-gray-500">Feed is empty</p>
      ) : (
        <UserCard feed={feed} currentIndex={currentIndex} handleCross={handleCross} handleTick={handleTick} animation={animation}/>
        )}
    </div>
  );
}

export default Feed;