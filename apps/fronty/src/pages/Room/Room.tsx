import { Loading } from '@teikna/components/Loading';
import { SocketContext } from '@teikna/context';
import { RoomEvent } from '@teikna/enums';
import { useStore } from '@teikna/store';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../../components/Container';
import TurnEnd from '../TurnEnd/TurnEnd';
import Chat from './components/Chat/Chat';
import Canvas from './components/Canvas';
import Header from './components/Header/Header';
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
            <TurnEnd />
            <Canvas />
          </CanvasWrapper>
          <Chat />
        </ContentWrapper>
      </RoomWrapper>
    </Container>
  );
};

export default ChatRoom;
