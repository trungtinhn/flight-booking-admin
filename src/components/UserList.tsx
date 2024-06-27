import React from 'react';
import { User } from '../services/api';
import './UserList.css'; // Importing the CSS file

interface UserListProps {
    users: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onSelectUser }) => {
    return (
        <div className="user-list">
            <h1 className="user-list-title">Support Customer</h1>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className={`user-item ${selectedUser?.id === user.id ? 'user-item-selected' : ''}`}
                        onClick={() => onSelectUser(user)}
                    >
                        <img src={user.avatarUrl} alt="Avatar" className="user-avatar" />
                        <div>
                            <div className="user-name">{user.fullName}</div>
                            <div className="user-status">New message</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
