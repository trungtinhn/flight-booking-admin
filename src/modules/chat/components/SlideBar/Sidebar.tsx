import React from 'react';
import { SidebarContainer, UserList, UserItem, UserAvatar, UserName } from './Sidebar.styles';

const users = [
    { id: 1, name: 'Mical Clark', avatar: 'avatar1.png' },
    { id: 2, name: 'Colin Nathan', avatar: 'avatar2.png' },
    { id: 3, name: 'Nathan Johen', avatar: 'avatar3.png' },
    { id: 4, name: 'Semi Doe', avatar: 'avatar4.png' },
];

interface SidebarProps {
    onSelectUser: (userId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectUser }) => {
    return (
        <SidebarContainer>
            <h2>Chats</h2>
            <UserList>
                {users.map(user => (
                    <UserItem key={user.id} onClick={() => onSelectUser(user.id)}>
                        <UserAvatar src={user.avatar} alt={user.name} />
                        <UserName>{user.name}</UserName>
                    </UserItem>
                ))}
            </UserList>
        </SidebarContainer>
    );
};

export default Sidebar;
