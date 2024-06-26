import React, { useEffect, useState } from 'react';
import UserList from '../../../components/UserList';
import ChatWindow from '../../../components/ChatWindow';
import { getUsers, User } from '../../../services/api';
import { Message, WebSocketService } from '../../../services/WebSocketService';


const AdminChatDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [wsService, setWsService] = useState<WebSocketService | null>(null);

    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const wsService = new WebSocketService(`ws://localhost:7050/ws`);
            wsService.onMessage = (msg) => {
                setMessages((prev) => [...prev, msg]);
            };
            setWsService(wsService);
            return () => wsService.close();
        }
    }, [selectedUser]);

    const handleSendMessage = (message: Message) => {
        if (wsService) {
            wsService.sendMessage(message);
            setMessages((prev) => [...prev, message]);
        }
    };

    return (
        <div className="flex h-screen">
            <UserList users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
            {selectedUser && (
                <ChatWindow selectedUser={selectedUser} messages={messages} onSendMessage={handleSendMessage} />
            )}
        </div>
    );
};

export default AdminChatDashboard;
