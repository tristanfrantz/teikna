import { User } from '@teikna/interfaces';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RoomContext, SocketContext, UserContext } from '../../context';

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const UserList = styled(List)`
  width: 200px;
`;

const UserListItem = styled.div<{ hasGuessedWord: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: ${(p) => p.theme.spacing}px;
  border-radius: 4px;
  background-color: ${(p) => (p.hasGuessedWord ? 'green' : 'white')};
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

const Users = () => {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);
  const user = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const sortedUserList = Object.values(room.users).sort((a, b) => b.score - a.score);
    setUsers(sortedUserList);
  }, [room]);

  return (
    <UserList>
      {users.map((u: User, index: number) => (
        <UserListItem key={index} hasGuessedWord={u.hasGuessedWord}>
          <UserListItemRow>
            <Username isSelf={u.id === user.id}>{u.name}</Username>
            <Index>{`${index + 1}#`}</Index>
          </UserListItemRow>
          <UserListItemRow>
            {/* <UserImage src={user.img} /> */}
            <Score>{u.score}</Score>
          </UserListItemRow>
        </UserListItem>
      ))}
    </UserList>
  );
};

export default Users;
