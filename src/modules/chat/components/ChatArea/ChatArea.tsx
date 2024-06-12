import React, { useState } from 'react';
import { ChatAreaContainer, ChatHeader, ChatBody, ChatInputContainer, ChatInput, ChatButton, MessageItem, MessageContent } from './ChatArea.styles';

interface ChatAreaProps {
    selectedUser: number | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser }) => {
    const [messages, setMessages] = useState<{ content: string, senderId: number }[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages(prev => [...prev, { content: newMessage, senderId: 1 }]);
            setNewMessage('');
        }
    };

    return (
        <ChatAreaContainer>
            <ChatHeader>
                <div>Chat với {selectedUser}</div>
            </ChatHeader>
            <ChatBody>
                {messages.map((msg, index) => (
                    <MessageItem key={index} isSender={msg.senderId === 1}>
                        <MessageContent isSender={msg.senderId === 1}>
                            {msg.content}
                        </MessageContent>
                    </MessageItem>
                ))}
            </ChatBody>
            <ChatInputContainer>
                <ChatInput
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập nội dung..."
                />
                <ChatButton onClick={handleSendMessage}>Gửi</ChatButton>
            </ChatInputContainer>
        </ChatAreaContainer>
    );
};

export default ChatArea;
