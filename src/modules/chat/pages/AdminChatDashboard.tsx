import React, { useEffect, useState } from 'react';
import UserList from '../../../components/UserList';
import ChatWindow from '../../../components/ChatWindow';
import { getUsers, User } from '../../../../src/services/api';
import { Message, WebSocketService } from '../../../../src/services/WebSocketService';
import './AdminChatDashboard.css'; // Importing the CSS file

const AdminChatDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            const users = await getUsers();
            setUsers(users);
        }
        fetchUsers();

        const wsService = new WebSocketService('ws://localhost:7050/ws');
        wsService.onMessage = (msg: Message) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };
        setWebSocketService(wsService);

        return () => {
            wsService.close();
        };
    }, []);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        // Fetch messages for the selected user from the server if needed
    };

    const handleSendMessage = (message: Message) => {
        if (webSocketService) {
            webSocketService.sendMessage(message);
        }
    };

    return (
        <div className="dashboard">
            <UserList users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
            {selectedUser && (
                <ChatWindow selectedUser={selectedUser} messages={messages} onSendMessage={handleSendMessage} />
            )}
        </div>
    );
};
export default AdminChatDashboard;
