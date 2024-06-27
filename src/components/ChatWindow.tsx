import React, { useState, useEffect } from 'react';
import { Message, WebSocketService } from '../services/WebSocketService';
import { User } from '../services/api';
import './ChatWindow.css'; // Importing the CSS file

interface ChatWindowProps {
    selectedUser: User;
    messages: Message[];
    onSendMessage: (message: Omit<Message, 'id'>) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

    useEffect(() => {
        // Initialize WebSocket service
        const wsService = new WebSocketService('ws://localhost:7050/ws');
        wsService.onMessage = (msg: Message) => {
            console.log('WebSocket message received:', msg); // Debug log
            if ((msg.receiverId === selectedUser.id.toString() || msg.senderId === selectedUser.id.toString()) && !chatHistory.some(m => m.createdAt === msg.createdAt && m.message === msg.message)) {
                setChatHistory(prevMessages => [...prevMessages, msg]);
            }
        };
        setWebSocketService(wsService);

        return () => {
            wsService.close();
        };
    }, [selectedUser, chatHistory]);

    useEffect(() => {
        // Fetch chat history for the selected user
        if (selectedUser) {
            fetchChatHistory(selectedUser.id.toString());
        }
    }, [selectedUser]);

    const fetchChatHistory = async (userId: string) => {
        const response = await fetch(`http://localhost:7050/api/messages/history/1/${userId}`);
        const data: Message[] = await response.json();
        setChatHistory(data);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Omit<Message, 'id'> = {
                senderId: '1', // Admin ID is always 1
                receiverId: selectedUser.id.toString(), // Convert to string
                message: newMessage.trim(),
                createdAt: new Date().toISOString()
            };
            console.log('Sending message:', message); // Debug log
            onSendMessage(message);
            setNewMessage('');
            // Add message to chat history with a temporary flag
            setChatHistory(prevMessages => [...prevMessages, { ...message, id: Date.now() }]);
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <img src={selectedUser.avatarUrl} alt="Avatar" className="chat-avatar" />
                <div>{selectedUser.fullName}</div>
            </div>
            <div className="chat-messages">
                {chatHistory.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.senderId === '1' ? 'chat-message-sent' : 'chat-message-received'}`}>
                        <div className="message-content">
                            {msg.message}
                        </div>
                        <div className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Send message here"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
