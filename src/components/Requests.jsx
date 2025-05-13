import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux';
import { addRequest } from '../utils/requestSlice';
import { addconnection, addsingleconnection } from '../utils/connectionSlice';
import axios from 'axios';
import Notification from './Notification';

function Requests() {
    const requestsrecieved = useSelector((store)=>store.requests);
    const dispatch = useDispatch();
    const [notification, setNotification] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL+'/user/requests/recieved',{withCredentials:true});
            console.log(res.data);
            dispatch(addRequest(res.data));
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            const res = await axios.post(BASE_URL+`/request/recieved/accepted/${requestId}`, {}, 
                { withCredentials: true }
            );
            // Refresh requests after accepting
            console.log(res.data);
            dispatch(addsingleconnection(res.data));
            fetchRequests();
            
            // Show success notification
            setNotification({ message: "You accepted the connection request", type: "success" });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(BASE_URL+`/request/recieved/rejected/${requestId}`, {}, 
                { withCredentials: true }
            );
            // Refresh requests after rejecting
            fetchRequests();
            
            // Show reject notification
            setNotification({ message: "You rejected the connection request", type: "error" });
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                />
            )}
            
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Received Requests</h2>
                
                {!requestsrecieved || requestsrecieved.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                        <p className="text-gray-500 text-lg">No pending requests</p>
                        <p className="text-gray-400 text-sm mt-2">When someone likes your profile, their request will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requestsrecieved.map((request) => (
                            <div 
                                key={request._id} 
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={request.senderID.photourl || 'default-avatar.png'} 
                                        alt={`${request.senderID.firstname}'s profile`}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {request.senderID.firstname} {request.senderID.lastname}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Age: {request.senderID.age}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Gender: {request.senderID.gender}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button 
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                        onClick={() => handleAccept(request.senderID._id)}
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        onClick={() => handleReject(request.senderID._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Requests;