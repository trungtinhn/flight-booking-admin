import React from "react";
import { useState } from "react";
const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title } = Typography;
import { Layout, Input, Button, List, Typography } from "antd";
import "./ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { text: inputValue, sender: "You" }]);
      setInputValue("");
    }
  };

  return (
    <Layout className="layout">
      <Content style={{ paddingBottom: "20px" }}>
        <div className="chat-container">
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item
                className="chat-bubble"
                style={{
                  justifyContent:
                    item.sender === "You" ? "flex-end" : "flex-start",
                  border: "none",
                }}
              >
                <div
                  className={`bubble ${
                    item.sender === "You" ? "bubble-right" : "bubble-left"
                  }`}
                >
                  <Typography.Text className="sender">
                    {item.sender}
                  </Typography.Text>
                  <div className="message">{item.text}</div>
                </div>
              </List.Item>
            )}
            className="chat-messages"
          />
          <div className="chat-input">
            <TextArea
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
            />
            <Button
              type="primary"
              onClick={handleSend}
              style={{ marginTop: 10 }}
            >
              Send
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ChatPage;
