import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 300px;
  border-right: 1px solid #ccc;
  padding: 10px;
  background-color: #f4f4f6;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background-color: #28B446;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: space-between;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: scroll;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const ChatMessage = styled.div<{ isAdmin: boolean }>`
  align-self: ${props => (props.isAdmin ? 'flex-end' : 'flex-start')};
  color: black;
  margin: 5px 0;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  max-width: 70%;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #f9f9f9;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ChatButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #28B446;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SupportButton = styled.button`
  padding: 5px 10px;
  border: none;
  background-color: #28B446;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

const Header = styled.h2`
  color: black;
`;

const CustomerListItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  color: black;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const MessageTimestamp = styled.div`
  font-size: 0.8em;
  color: #888;
  margin-top: 4px;
`;

interface Message {
    content: string;
    senderId: number;
    receiverId?: number;
    type?: string;
    createdAt: string;
}

interface UserWithLatestMessage {
    id: number;
    fullName: string;
    avatarUrl: string;
    latestMessage: string;
}

const AdminChatDashboard: React.FC = () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aHVvbmcxMjMiLCJpYXQiOjE3MTgxODEyNDEsImV4cCI6MTcxODE5NTY0MX0.jtWj0o61riFvmxRdvhko9rhYmHnNwfvqV8embrDHS90"; // Token của admin
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [customers, setCustomers] = useState<UserWithLatestMessage[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [adminId, setAdminId] = useState<number | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const chatBodyRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchAdminId = async () => {
            try {
                const response = await fetch(`https://flightbookingbe-production.up.railway.app/users/token?token=${token}`);
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
        const fetchCustomersWithLatestMessages = async () => {
            try {
                const response = await fetch('https://flightbookingbe-production.up.railway.app/message/users-with-latest-messages');
                if (response.ok) {
                    const data: UserWithLatestMessage[] = await response.json();
                    setCustomers(data);
                } else {
                    console.error('Failed to fetch customers with latest messages');
                }
            } catch (error) {
                console.error('Error fetching customers with latest messages', error);
            }
        };

        fetchCustomersWithLatestMessages();
    }, []);

    useEffect(() => {
        const connectWebSocket = () => {
            socketRef.current = new WebSocket('wss://flightbookingbe-production.up.railway.app/ws');

            socketRef.current.onopen = () => {
                console.log('WebSocket connected');
                if (socketRef.current && adminId) {
                    socketRef.current.send(JSON.stringify({ type: 'JOIN_ADMIN', senderId: adminId }));
                }
            };

            socketRef.current.onmessage = (event) => {
                const message: Message = JSON.parse(event.data);
                setMessages((prevMessages) => {
                    const existingMessage = prevMessages.find(msg => msg.content === message.content && msg.senderId === message.senderId);
                    if (!existingMessage) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });

                if (message.senderId !== adminId) {
                    setCustomers((prev) => {
                        const existingCustomer = prev.find((c) => c.id === message.senderId);
                        if (existingCustomer) {
                            existingCustomer.latestMessage = message.content;
                            return [...prev];
                        }
                        return [...prev, { id: message.senderId, fullName: `Customer ${message.senderId}`, avatarUrl: "/path/to/default/avatar.png", latestMessage: message.content }];
                    });
                }
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket disconnected, attempting to reconnect...');
                setTimeout(connectWebSocket, 5000);
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        if (adminId) {
            connectWebSocket();
        }

        return () => {
            socketRef.current?.close();
        };
    }, [adminId]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && socketRef.current?.readyState === WebSocket.OPEN && adminId && activeChat) {
            const message: Message = {
                content: newMessage,
                senderId: adminId,
                receiverId: activeChat,
                createdAt: new Date().toISOString(),
            };
            setIsSending(true);
            socketRef.current?.send(JSON.stringify(message));
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
            setTimeout(() => setIsSending(false), 1000);
        } else {
            console.log('WebSocket is not open, no active chat, or message is empty');
        }
    };

    const handleSupportCustomer = (customerId: number) => {
        setActiveChat(customerId);

        fetch(`https://flightbookingbe-production.up.railway.app/message/support/start/${adminId}/${customerId}`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Support started', data);
            });

        fetchMessagesForCustomer(customerId);
    };

    const fetchMessagesForCustomer = async (customerId: number) => {
        try {
            const response = await fetch(`https://flightbookingbe-production.up.railway.app/messages/${customerId}`);
            if (response.ok) {
                const data: Message[] = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to fetch messages for customer');
            }
        } catch (error) {
            console.error('Error fetching messages for customer', error);
        }
    };

    const handleEndSupport = () => {
        if (activeChat !== null) {
            fetch(`https://flightbookingbe-production.up.railway.app/message/support/end/${adminId}/${activeChat}`, {
                method: 'POST',
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Support ended', data);
                    setActiveChat(null);
                    setMessages([]);
                });
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !isSending) {
            handleSendMessage();
        }
    };

    return (
        <DashboardContainer>
            <Sidebar>
                <Header>Customer Support</Header>
                {customers.map((customer) => (
                    <CustomerListItem key={customer.id}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={customer.avatarUrl || '/path/to/default/avatar.png'} alt={customer.fullName} />
                            <div>
                                <div>{customer.fullName}</div>
                                <div>{customer.latestMessage}</div>
                            </div>
                        </div>
                        <SupportButton onClick={() => handleSupportCustomer(customer.id)}>Hỗ trợ</SupportButton>
                    </CustomerListItem>
                ))}
            </Sidebar>
            <ChatContainer>
                {activeChat !== null ? (
                    <>
                        <ChatHeader>
                            <div>Admin - Đang hỗ trợ Customer {activeChat}</div>
                            <SupportButton onClick={handleEndSupport}>Kết thúc hỗ trợ</SupportButton>
                        </ChatHeader>
                        <ChatBody ref={chatBodyRef}>
                            {messages
                                .filter(
                                    (msg) =>
                                        msg.senderId === activeChat ||
                                        msg.receiverId === activeChat ||
                                        msg.senderId === adminId ||
                                        msg.receiverId === adminId
                                )
                                .map((msg, index) => (
                                    <ChatMessage key={index} isAdmin={msg.senderId === adminId}>
                                        <span>{msg.content}</span>
                                        <MessageTimestamp>{new Date(msg.createdAt).toLocaleString()}</MessageTimestamp>
                                    </ChatMessage>
                                ))}
                        </ChatBody>
                        <ChatInputContainer>
                            <ChatInput
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập nội dung..."
                            />
                            <ChatButton onClick={handleSendMessage} disabled={isSending}>Gửi</ChatButton>
                        </ChatInputContainer>
                    </>
                ) : (
                    <div>Chọn khách hàng để hỗ trợ</div>
                )}
            </ChatContainer>
        </DashboardContainer>
    );
};

export default AdminChatDashboard;
