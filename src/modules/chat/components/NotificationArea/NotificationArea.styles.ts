import styled from 'styled-components';

export const NotificationAreaContainer = styled.div`
  width: 250px;
  border-left: 1px solid #ddd;
  padding: 20px;
`;

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const NotificationAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const NotificationText = styled.div`
  font-size: 14px;
`;
