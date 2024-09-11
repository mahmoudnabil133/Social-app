import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './chat.css'; // Assuming you'll use a separate CSS file for styling

const socket = io.connect('http://localhost:3001', {
    auth: {
        token: localStorage.getItem('token')
    }
});

const Chat = () => {
    const token = localStorage.getItem('token');
    // const navigate = useNavigate();
    const [friends, setFriends] = useState([]); // Friends list
    const [myAccount, setMyAccount] = useState({}); // User details
    const [message, setMessage] = useState(''); // Message input
    const [messages, setMessages] = useState([]); // Array of messages (sent/received)
    const [selectedFriend, setSelectedFriend] = useState(null); // Selected friend for chat
    // const [recievedMessage, setRecievedMessage] = useState(''); // Received message data
    // const [messageSender, setMessageSender] = useState(''); // Sender of received message

    // Fetch user account info and friends
    const getMyAccount = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMyAccount(response.data.data);
            setFriends(response.data.data.friends); // Assuming friends is an array of users
        } catch (err) {
            console.log(err);
        }
    };

    // Send message to a friend
    const sendMessage = () => {
        if (selectedFriend && message) {
            socket.emit('send-message', {
                recievedId: selectedFriend._id, // Friend's ID
                message: message,
                from: myAccount.userName // Sender's username
            });
            // Add the sent message to the local message array
            setMessages(prevMessages => [
                ...prevMessages,
                { message: message, sender: myAccount.userName, type: 'sent' }
            ]);
            setMessage(''); // Clear input after sending
        }
    };

    useEffect(() => {
        getMyAccount(); // Fetch user account info and friends
        const recieveMessage = (data) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { message: data.message, sender: data.from, type: 'received' }
            ]);
            // setMessageSender(data.from); // Set the sender's name
        };
    
        // Register the socket event listener once
        socket.on('recieve-message', recieveMessage);
    
        // Cleanup listener on unmount or before re-running useEffect
        return () => {
            socket.off('recieve-message', recieveMessage);
        };
    }, []);
    

    return (
        <div className="chat-container">
            {/* Left Sidebar with Friends */}
            <div className="friends-list">
                <h2>Your Friends</h2>
                <ul>
                    {friends.map(friend => (
                        <li 
                            key={friend._id} 
                            className={`friend ${selectedFriend && selectedFriend._id === friend._id ? 'selected' : ''}`}
                            onClick={() => setSelectedFriend(friend)} // Select friend for chat
                        >
                            <strong>{friend.userName}</strong> - {friend.email}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="chat-window">
                {selectedFriend ? (
                    <>
                        <h3>Chat with {selectedFriend.userName}</h3>
                        <div className="chat-box">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index}
                                    className={`message ${msg.type === 'sent' ? 'sent' : 'received'}`}
                                >
                                    {msg.message}
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <h3>Select a friend to start chatting</h3>
                )}
            </div>
        </div>
    );
};

export default Chat;
