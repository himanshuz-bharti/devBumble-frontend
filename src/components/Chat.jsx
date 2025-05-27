import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createSocket } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

export default function ChatInterface() {
  const { id } = useParams();
  const Loggedinuser = useSelector((store) => store.user);
  const fromUserId = Loggedinuser?._id;
  const [reciever, setReciever] = useState({
    firstname: 'Loading...',
    lastname: 'Loading...',
    photourl: '',
    isFriend: false, // Default to false
  });
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');

  const getRecieverDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/${id}`, { withCredentials: true });
      setReciever(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching receiver details:', error.message);
      return null;
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${id}`, { withCredentials: true });
     // console.log(res.data.messages);
      const newMessages = res.data.messages.map((message) => {
        const isOutgoing = message.senderId._id === fromUserId;
        const sender = isOutgoing ? 'You' : message.senderId.firstname;
        const status = isOutgoing ? 'sent' : 'received';
        return {
          id: uuidv4(),
          sender,
          content: message.text,
          timestamp: new Date(message.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          status,
          isOutgoing,
        };
      });
      setMessages(newMessages);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      setMessages([]); // Reset messages on error
    }
  };

  useEffect(() => {
    if (!fromUserId) return;

    const initChat = async () => {
      const recieverData = await getRecieverDetails();
      if (recieverData && recieverData.isFriend) {
        await fetchMessages();
      }
    }
    initChat();
      const socket = createSocket();
      socketRef.current = socket;
      socket.emit('joinChat', { firstName: Loggedinuser?.firstname, fromUserId, toUserId: id });

      socket.on('recieved-message', ({ firstName, message }) => {
        const newMsg = {
          id: uuidv4(),
          sender: firstName,
          content: message,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          status: 'received',
          isOutgoing: false,
        };
        setMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
      });

      return () => socket.disconnect();
  }, [fromUserId, id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !socketRef.current || !reciever.isFriend) return;

    const newMsg = {
      id: uuidv4(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: 'sent',
      isOutgoing: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    socketRef.current.emit('send-message', {
      firstName: Loggedinuser?.firstname,
      fromUserId,
      toUserId: id,
      message: newMessage,
    });
    setNewMessage('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <Check size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {reciever.photourl ? (
              <img className="w-10 h-10 rounded-full" src={reciever.photourl} alt="User profile" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">JD</span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{reciever.firstname} {reciever.lastname}</h2>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {reciever.isFriend ? (
          messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
                    message.isOutgoing
                      ? 'bg-blue-400 text-white rounded-br-none'
                      : 'bg-yellow-300 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-xs font-medium text-red-600 mb-1">{message.sender}</p>
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`flex justify-end items-center space-x-1 mt-1 ${
                      message.isOutgoing ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    <span className="text-xs">{message.timestamp}</span>
                    {message.isOutgoing && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-4">No messages yet.</div>
          )
        ) : (
          <div className="text-center text-gray-500 mt-4">You can only view messages with friends.</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      {reciever.isFriend ? (
        <div className="bg-white px-4 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="text-gray-500 hover:text-gray-700 transition-colors mx-1">
                <Smile size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <Mic size={20} />
              </button>
            </div>
            <button
              className="bg-green-500 text-white rounded hover:bg-green-800"
              onClick={handleSendMessage}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 py-3 border-t border-gray-200 text-center text-gray-500">
          You can only chat with friends.
        </div>
      )}
    </div>
  );
}