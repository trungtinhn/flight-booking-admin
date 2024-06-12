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
const MessageTimestamp = styled.div`
  font-size: 0.8em;
  color: #888;
  margin-top: 4px;
`;

interface Message {
    content: string;
    senderId: number;
    receiverId?: number;
}

interface Customer {
    id: number;
    name: string;
    messages: Message[];
}

const AdminChatDashboard: React.FC = () => {
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const chatBodyRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            socketRef.current = new WebSocket('ws://localhost:7050/ws');

            socketRef.current.onopen = () => {
                console.log('WebSocket connected');
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
                if (message.senderId !== 2) {
                    setCustomers((prev) => {
                        const existingCustomer = prev.find((c) => c.id === message.senderId);
                        if (existingCustomer) {
                            existingCustomer.messages.push(message);
                            return [...prev];
                        }
                        return [...prev, { id: message.senderId, name: `Customer ${message.senderId}`, messages: [message] }];
                    });
                }
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket disconnected, attempting to reconnect...');
                setTimeout(connectWebSocket, 5000); // Tự động kết nối lại sau 5 giây
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connectWebSocket();

        return () => {
            socketRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
            const message: Message = {
                content: newMessage,
                senderId: 2, // ID của admin
                receiverId: 1, // ID của khách hàng đang hỗ trợ
            };
            setIsSending(true); // Bắt đầu gửi tin nhắn
            socketRef.current?.send(JSON.stringify(message));
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
            setTimeout(() => setIsSending(false), 1000); // Kết thúc gửi tin nhắn sau 1 giây
        } else {
            console.log('WebSocket is not open, no active chat, or message is empty');
        }
    };

    const handleSupportCustomer = (customerId: number) => {
        setActiveChat(customerId);
        const customer = customers.find((c) => c.id === customerId);
        if (customer) {
            setMessages(customer.messages);
        }

        fetch(`http://localhost:7050/message/support/start/2/${customerId}`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Support started', data);
            });
    };

    const handleEndSupport = () => {
        if (activeChat !== null) {
            fetch(`http://localhost:7050/message/support/end/2/${activeChat}`, {
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
                        <div>{customer.name}</div>
                        <div>{customer.messages[customer.messages.length - 1]?.content}</div>
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
                                        msg.senderId === 2 ||
                                        msg.receiverId === 2
                                )
                                .map((msg, index) => (
                                    <ChatMessage key={index} isAdmin={msg.senderId === 2}>
                                        <span>{msg.content}</span>
                                        <MessageTimestamp>{new Date(Date.now()).toLocaleString()}</MessageTimestamp>
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
