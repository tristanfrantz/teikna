import React from 'react';
import styled from 'styled-components';
import { User } from '@teikna/interfaces';

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const UserList = styled(List)`
  width: 200px;
`;

const UserListItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: ${(p) => p.theme.spacing}px;
  border-radius: 4px;
  background-color: white;
  margin-bottom: 4px;
`;

const UserListItemRow = styled.div`
  margin-bottom: 6px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Index = styled.span`
  font-weight: 600;
  font-size: 18px;
`;

const Username = styled.span<{ isSelf: boolean }>`
  color: ${(p) => (p.isSelf ? 'blue' : 'fontPrimary')};
  font-size: 18px;
  font-weight: 500;
`;

const UserImage = styled.img`
  border-radius: 50%;
  object-fit: contain;
  width: 40px;
  height: 40px;
`;

const Score = styled.span`
  font-weight: 500;
`;

export const Users: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <UserList>
      {users.map((user: User, index: number) => (
        <UserListItem key={user.name}>
          <UserListItemRow>
            <Username isSelf={user.name === ''}>{user.name}</Username>
            <Index>{`${index + 1}#`}</Index>
          </UserListItemRow>
          <UserListItemRow>
            {/* <UserImage src={user.img} /> */}
            <Score>{user.score}</Score>
          </UserListItemRow>
        </UserListItem>
      ))}
    </UserList>
  );
};
