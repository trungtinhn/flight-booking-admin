import React from 'react';
import { User } from '../services/api';

interface UserListProps {
    users: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onSelectUser }) => {
    return (
        <div className="w-1/4 bg-gray-100 p-4">
            <h1 className="text-xl font-bold">Support Customer</h1>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className={`p-2 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-500 text-white' : ''}`}
                        onClick={() => onSelectUser(user)}
                    >
                        <div>{user.name}</div>
                        <div className="text-sm text-gray-600">New message</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
