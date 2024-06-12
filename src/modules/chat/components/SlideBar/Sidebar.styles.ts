import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 20px;
`;

export const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const UserItem = styled.div`
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

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 500;
`;
