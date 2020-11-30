import React, { ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../../components/Container';

const ContentWrapper = styled.div`
  width: 400px;
  height: 400px;
  border: 1px solid red;
`;

const Input = styled.input`
  width: 100%;
  padding: ${(p) => p.theme.spacing}px;
`;

const Home = () => {
  const [roomName, setRoomName] = React.useState('');
  const [username, setUsername] = React.useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('name');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleRoomJoin = () => {
    localStorage.setItem('name', username);
  };

  return (
    <Container>
      <ContentWrapper>
        <Input type="text" placeholder="Enter your name" value={username} onChange={handleUsernameChange} />
        <Input type="text" placeholder="Room" value={roomName} onChange={handleRoomNameChange} />
        <Link to={`/${roomName}`} className="enter-room-button" onClick={handleRoomJoin}>
          Join room
        </Link>
      </ContentWrapper>
    </Container>
  );
};

export default Home;
