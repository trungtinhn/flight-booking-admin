import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styled from 'styled-components';

interface Message {
    content: string;
    senderId: number;
    receiverId: number | null;
    createdAt: string;
}

interface Session {
    id: number;
    customerId: number;
    status: string;
    latestMessage: string;
    customerAvatar: string; // Add customerAvatar field
}

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  flex: 1;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  padding: 20px;
`;

const ChatArea = styled.div`
  flex: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const ChatInputContainer = styled.div`
  display: flex;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ChatButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  margin-left: 10px;
`;

const ChatMessage = styled.div<{ isCustomer: boolean }>`
  align-self: ${props => (props.isCustomer ? 'flex-end' : 'flex-start')};
  color: black;
  margin: 5px 0;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  max-width: 70%;
`;

const MessageTimestamp = styled.div`
  font-size: 0.8em;
  color: #888;
  margin-top: 4px;
`;

const CustomerButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border: none;
  background: #f9f9f9;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: left;

  &:hover {
    background: #e9e9e9;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AdminChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [adminId, setAdminId] = useState<number | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
    const [currentCustomerName, setCurrentCustomerName] = useState<string>('');
    const [currentCustomerAvatar, setCurrentCustomerAvatar] = useState<string>('');
    const socketRef = useRef<WebSocket | null>(null);

    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aHVvbmdsZSIsImlhdCI6MTcxODIyOTk5NiwiZXhwIjoxNzE4MjQ0Mzk2fQ.NLq9kZXJhW1Oq2EVcinQBJLdw-57aGekTXEWwixM09A"; // Token của admin

    useEffect(() => {
        const fetchAdminId = async () => {
            try {
                const response = await fetch(`http://localhost:7050/users/token?token=${token}`);
                if (response.ok) {
                    const data = await response.json();
                    setAdminId(data.id);
                } else {
                    console.error('Failed to fetch admin ID');
                }
            } catch (error) {
                console.error('Error fetching admin ID', error);
            }
        };

        fetchAdminId();
    }, [token]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`http://localhost:7050/message/sessions`);
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                } else {
                    console.error('Failed to fetch sessions');
                }
            } catch (error) {
                console.error('Error fetching sessions', error);
            }
        };

        fetchSessions();
    }, []);

    useEffect(() => {
        const connectWebSocket = () => {
            socketRef.current = new WebSocket('ws://localhost:7050/ws');

            socketRef.current.onopen = () => {
                console.log('WebSocket connection established');
            };

            socketRef.current.onmessage = (event) => {
                const newMessage: Message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket connection closed');
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const handleSupport = (sessionId: number, customerId: number) => {
        setCurrentSessionId(sessionId);
        // Fetch customer's name and latest message
        const customer = sessions.find(session => session.id === sessionId);
        setCurrentCustomerName(`Customer ${customerId}`);
        setCurrentCustomerAvatar(customer?.customerAvatar || '');
        // Update session status to active
        fetch(`http://localhost:7050/message/startSupport?sessionId=${sessionId}&adminId=${adminId}`, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                setMessages(data.messages);
                // Send a message to customer to notify the admin is supporting
                if (socketRef.current) {
                    const notificationMessage: Message = {
                        content: 'Nhân viên đang hỗ trợ bạn...',
                        senderId: adminId!,
                        receiverId: customerId,
                        createdAt: new Date().toISOString() // Use ISO 8601 format
                    };
                    socketRef.current.send(JSON.stringify(notificationMessage));
                }
            }).catch(error => {
                console.error('Error updating session status', error);
            });
    };

    const endSupport = () => {
        if (currentSessionId) {
            fetch(`http://localhost:7050/message/endSession`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: currentSessionId })
            }).then(response => response.json())
                .then(() => {
                    setCurrentSessionId(null);
                    setMessages([]);
                }).catch(error => {
                    console.error('Error ending session', error);
                });
        }
    };

    const sendMessage = () => {
        if (adminId !== null && currentSessionId !== null && socketRef.current) {
            const messageContent: Message = {
                content: message,
                senderId: adminId,
                receiverId: currentSessionId,
                createdAt: new Date().toISOString() // Use ISO 8601 format
            };

            socketRef.current.send(JSON.stringify(messageContent));
            setMessage('');
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <ChatContainer>
            <Sidebar>
                <h2>Customer Support</h2>
                {sessions.filter(session => session.status === 'pending').map(session => (
                    <CustomerButton key={session.id} onClick={() => handleSupport(session.id, session.customerId)}>
                        <Avatar src={session.customerAvatar} alt="Avatar" />
                        <div>
                            <div>Customer {session.customerId}</div>
                            <div>{session.latestMessage}</div>
                        </div>
                    </CustomerButton>
                ))}
                <h2>Waiting on Close</h2>
                {sessions.filter(session => session.status === 'closed').map(session => (
                    <CustomerButton key={session.id}>
                        <Avatar src={session.customerAvatar} alt="Avatar" />
                        <div>Customer {session.customerId}</div>
                    </CustomerButton>
                ))}
            </Sidebar>
            <ChatArea>
                <ChatHeader>
                    <h3>{currentCustomerName}</h3>
                    {currentSessionId && <ChatButton onClick={endSupport}>Kết thúc hỗ trợ</ChatButton>}
                </ChatHeader>
                <ChatBody>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.senderId === adminId ? 'right' : 'left' }}>
                            <ChatMessage isCustomer={msg.senderId !== adminId}>
                                <div>{msg.content}</div>
                                <MessageTimestamp>{new Date(msg.createdAt).toLocaleString()}</MessageTimestamp>
                            </ChatMessage>
                        </div>
                    ))}
                </ChatBody>
                <ChatInputContainer>
                    <ChatInput
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <ChatButton onClick={sendMessage}>Send</ChatButton>
                </ChatInputContainer>
            </ChatArea>
        </ChatContainer>
    );
};

export default AdminChat;
