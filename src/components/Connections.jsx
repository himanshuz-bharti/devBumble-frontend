import React, { useState, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addconnection,removeconnection } from '../utils/connectionSlice';

function Connections() {
    const connections = useSelector((store)=>store.connections);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChat = (recieverID) =>{
      
      navigate('/chat/'+recieverID);
    }
    const unmatchhandle = async (requestID)=>{
      const res = await axios.post(BASE_URL+`/request/recieved/rejected/${requestID}`,{},{withCredentials:true});
      console.log("unmatch",res.data);
      dispatch(removeconnection(res.data));
    }
    const fetchConnections = async () =>{
       // if(connections) return;
       try {
         const res = await axios.get(BASE_URL+'/user/connections',{withCredentials:true});
         console.log("conn",res.data);
         dispatch(addconnection(res.data));
       } catch (error) {
            console.error(error.message);
       }
    }

    useEffect(() => {
      fetchConnections();
    }, []);

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Your Connections</h2>
        
        {!connections || connections.length === 0  ? (
          <p className="text-gray-500">No connections found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div 
                key={connection._id} 
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={connection.photourl || 'default-avatar.png'} 
                    alt={`${connection.firstname}'s profile`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {connection.firstname} {connection.lastname}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Age: {connection.age}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Gender: {connection.gender}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => {handleChat(connection._id)}}
                  >
                    Chat
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => {unmatchhandle(connection._id)}}
                  >
                    Unmatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    );
}

export default Connections;