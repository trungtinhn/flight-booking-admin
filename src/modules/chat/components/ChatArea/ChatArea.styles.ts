import styled from 'styled-components';

interface MessageItemProps {
  isSender: boolean;
}

export const ChatAreaContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ChatHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
`;

export const ChatBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const ChatButton = styled.button`
  padding: 10px;
  border: none;
  background-color: #98ff98;
  color: white;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

export const MessageItem = styled.div<MessageItemProps>`
  display: flex;
  justify-content: ${props => (props.isSender ? 'flex-end' : 'flex-start')};
  margin: 10px 0;
`;

export const MessageContent = styled.div<MessageItemProps>`
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${props => (props.isSender ? '#98ff98' : '#f1f1f1')};
  color: ${props => (props.isSender ? 'white' : 'black')};
`;
