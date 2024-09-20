import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './chat.css'; // Assuming you'll use a separate CSS file for styling
import BaseUrl from '../api/api';
const socket = io.connect(`http://www.mahmoudnabil.tech:3001`, {
    auth: {
        token: localStorage.getItem('token')
    }
});

const Chat = () => {
    const token = localStorage.getItem('token');
    const [friends, setFriends] = useState([]); // Friends list
    const [myAccount, setMyAccount] = useState({}); // User details
    const [message, setMessage] = useState(''); // Message input
    const [messages, setMessages] = useState([]); // Array of messages (sent/received)
    const [selectedFriend, setSelectedFriend] = useState(null); // Selected friend for chat

    // Fetch user account info and friends
    const getMyAccount = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMyAccount(response.data.data);
            setFriends(response.data.data.friends); // Assuming friends is an array of users
            console.log(myAccount._id);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch chat history with the selected friend
    const getChat = async (friendId) => {
        try {
            const response = await axios.get(`${BaseUrl}/chat/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessages(response.data.data); // Assuming response contains the array of messages
            console.log(response.data.data);
        } catch (err) {
            console.log(err);
        }
    };
    // Add this function above or inside your Chat component
    const formatTime = (time) => {
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Send message to a friend
    const sendMessage = () => {
        if (selectedFriend && message) {
            const currentTime = new Date().toISOString();
            socket.emit('send-message', {
                recievedId: selectedFriend._id, // Friend's ID
                message: message,
                from: myAccount._id ,// Sender's username
                timeStamps: currentTime

            });
            // Add the sent message to the local message array
            setMessages(prevMessages => [
                ...prevMessages,
                { message: message, from: myAccount._id, timeStamps: currentTime, type: 'sent' }
            ]);
            setMessage(''); // Clear input after sending
        }
    };

    // Listen for incoming messages
    useEffect(() => {
        if (selectedFriend) {
            getChat(selectedFriend._id);
        }
        getMyAccount(); // Fetch user account info and friends

        const recieveMessage = (data) => {
            console.log(data);
            setMessages(prevMessages => [
                ...prevMessages,
                { message: data.message, from: data.from, timeStamps: data.timeStamps ,type: 'received' }
            ]);
        };

        // Register the socket event listener
        socket.on('recieve-message', recieveMessage);

        // Cleanup listener on unmount
        return () => {
            socket.off('recieve-message', recieveMessage);
        };
    }, [selectedFriend]);

    // Fetch chat when a friend is selected
    // useEffect(() => {

    // }, [selectedFriend]);

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
                                    className={`message ${msg.from === myAccount._id ? 'sent' : 'received'}`}
                                >
                                    <>
                                        <div className="message-content">
                                            {msg.message}
                                        </div>
                                        <div className="message-time">
                                            {formatTime(msg.timeStamps)} {/* Display formatted time */}
                                        </div>
                                    </>
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
