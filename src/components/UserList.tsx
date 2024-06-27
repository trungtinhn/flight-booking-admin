import React, { useState, useEffect } from 'react';
import { User, getUsers } from '../services/api';
import { WebSocketService, Message } from '../services/WebSocketService';
import './UserList.css'; // Importing the CSS file

interface UserListProps {
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ selectedUser, onSelectUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

    useEffect(() => {
        fetchUsers();

        // Initialize WebSocket service
        const wsService = new WebSocketService('ws://localhost:7050/ws');
        wsService.onMessage = (msg: Message) => {
            console.log('WebSocket message received:', msg); // Debug log
            fetchUsers();
        };
        setWebSocketService(wsService);

        return () => {
            wsService.close();
        };
    }, []);

    const fetchUsers = async () => {
        const userList = await getUsers();
        const latestMessagesResponse = await fetch('http://localhost:7050/api/messages/latest');
        const latestMessages = await latestMessagesResponse.json();

        const updatedUsers = userList.map(user => {
            const latestMessage = latestMessages.find((msg: any) => msg.senderId === user.id.toString() || msg.receiverId === user.id.toString());
            return {
                ...user,
                latestMessage: latestMessage ? latestMessage.message : 'No messages'
            };
        });

        setUsers(updatedUsers.sort((a, b) => {
            const dateA = new Date(latestMessages.find((msg: any) => msg.senderId === a.id.toString() || msg.receiverId === a.id.toString())?.createdAt || 0);
            const dateB = new Date(latestMessages.find((msg: any) => msg.senderId === b.id.toString() || msg.receiverId === b.id.toString())?.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
        }));
    };

    const handleSelectUser = (user: User) => {
        onSelectUser(user);
    };

    return (
        <div className="user-list">
            <h1 className="user-list-title">Support Customer</h1>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className={`user-item ${selectedUser?.id === user.id ? 'user-item-selected' : ''}`}
                        onClick={() => handleSelectUser(user)}
                    >
                        <img src={user.avatarUrl} alt="Avatar" className="user-avatar" />
                        <div>
                            <div className="user-name">{user.fullName}</div>
                            <div className="user-status">{user.latestMessage}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
