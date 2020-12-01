import React, { ChangeEvent, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
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

const CreateRoomButton = styled.button`
  width: 100%;
  padding: 12px;
`;

const Home = () => {
  const [username, setUsername] = React.useState('');
  const roomName = '';

  const history = useHistory();

  useEffect(() => {
    const savedUsername = localStorage.getItem('name');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    localStorage.setItem('name', event.target.value);
  };

  return (
    <Container>
      <ContentWrapper>
        <Input type="text" placeholder="Enter your name" value={username} onChange={handleUsernameChange} />
        <Link to={`/room`} className="enter-room-button">
          create a private room
        </Link>
      </ContentWrapper>
    </Container>
  );
};

export default Home;
