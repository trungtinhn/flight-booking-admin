import React, { useState } from 'react';
import { Message } from '../services/WebSocketService';
import { User } from '../services/api';

interface ChatWindowProps {
    selectedUser: User;
    messages: Message[];
    onSendMessage: (message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                userId: selectedUser.id,
                message: newMessage.trim(),
            };
            onSendMessage(message);
            setNewMessage('');
        }
    };

    return (
        <div className="w-3/4 bg-gray-50 p-4 flex flex-col">
            <div className="bg-blue-100 p-4 mb-4 flex items-center">
                <div className="bg-gray-300 rounded-full w-16 h-16 mr-4"></div>
                <div>{selectedUser.name}</div>
            </div>
            <div className="flex-1 bg-gray-200 p-4 mb-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.userId === selectedUser.id ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded ${msg.userId === selectedUser.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center p-4 bg-white border-t">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded p-2"
                    placeholder="Send message here"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="ml-4 bg-blue-500 text-white p-2 rounded" onClick={handleSendMessage}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
