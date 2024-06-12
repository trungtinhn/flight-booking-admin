import React from 'react';
import { NotificationAreaContainer, NotificationList, NotificationItem, NotificationAvatar, NotificationText } from './NotificationArea.styles';

const notifications = [
    { id: 1, name: 'Nathan', text: 'Nullam facilisis velit eu nulla dictum volutpat.', avatar: 'avatar1.png' },
    { id: 2, name: 'Christian', text: 'Proin iaculis eros non odio ornare efficitur.', avatar: 'avatar2.png' },
    { id: 3, name: 'Dylan', text: 'Morbi quis ex eu arcu auctor sagittis.', avatar: 'avatar3.png' },
];

const NotificationArea: React.FC = () => {
    return (
        <NotificationAreaContainer>
            <h2>Notifications</h2>
            <NotificationList>
                {notifications.map(notification => (
                    <NotificationItem key={notification.id}>
                        <NotificationAvatar src={notification.avatar} alt={notification.name} />
                        <NotificationText>{notification.text}</NotificationText>
                    </NotificationItem>
                ))}
            </NotificationList>
        </NotificationAreaContainer>
    );
};

export default NotificationArea;
