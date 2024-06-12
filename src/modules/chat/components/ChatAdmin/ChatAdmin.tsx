import React, { useState } from 'react';
import { ChatAdminContainer } from './ChatAdmin.styles';
import Sidebar from '../SlideBar/Sidebar';
import ChatArea from '../ChatArea/ChatArea';
import NotificationArea from '../NotificationArea/NotificationArea';

const ChatAdmin: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    return (
        <ChatAdminContainer>
            <Sidebar onSelectUser={setSelectedUser} />
            <ChatArea selectedUser={selectedUser} />
            <NotificationArea />
        </ChatAdminContainer>
    );
};

export default ChatAdmin;
