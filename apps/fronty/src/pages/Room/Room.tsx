import { Loading } from '@teikna/components/Loading';
import { useStore } from '@teikna/store';
import React from 'react';
import Container from '../../components/Container';
import Chat from './components/Chat/Chat';
import Canvas from './components/Canvas';
import Header from './components/Header/Header';
import Overlay from './components/Overlay/Overlay';
import Users from './components/Users';
import { CanvasWrapper, ContentWrapper, RoomWrapper } from './Room.styles';

const ChatRoom = () => {
  return (
    <Container>
      <RoomWrapper>
        <Header />
        <ContentWrapper>
          <Users />
          <CanvasWrapper>
            <Overlay />
            <Canvas />
          </CanvasWrapper>
          <Chat />
        </ContentWrapper>
      </RoomWrapper>
    </Container>
  );
};

export default ChatRoom;
