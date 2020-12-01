import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Container from '../../components/Container';
import { RoomContext, SocketContext, UserContext } from '../../context';
import useRoomSocket from '../../hooks/useRoomSocket';
import { RoomRouteParams } from '../../router';
import Lobby from '../Lobby/Lobby';
import Messages from './Chat';
import DrawingBoard from './DrawingBoard';
import { CanvasWrapper, ContentWrapper, Header, RoomWrapper, Round, Timer } from './Room.styles';
import Users from './Users';

const ChatRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  // const { room } = useRoomSocket(roomId);

  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const room = useContext(RoomContext);

  if (!socket || !user || !room) {
    return <div>Loading or failure</div>;
  }

  return (
    <Container>
      <RoomWrapper>
        <Header>
          <Timer
            src={
              'https://images.vexels.com/media/users/3/192919/isolated/preview/28fece9fbbd599d507ecd28c8febacf8-stopwatch-timer-stroke-icon-stopwatch-by-vexels.png'
            }
          />
          <Round>{`Round ${room.currentRound} of ${room.roundCount}`}</Round>
          <button onClick={() => console.log('hi')}>start round 👨</button>
        </Header>
        <ContentWrapper>
          <Users />
          <CanvasWrapper>
            <DrawingBoard />
          </CanvasWrapper>
          <Messages />
        </ContentWrapper>
      </RoomWrapper>
    </Container>
  );
};

export default ChatRoom;
