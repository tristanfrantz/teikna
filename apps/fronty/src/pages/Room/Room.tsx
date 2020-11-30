import React from 'react';
import { useParams } from 'react-router-dom';
import DrawingBoard from './DrawingBoard';
import { RoomRouteParams } from '../../router';
import { CanvasWrapper, RoomWrapper, Header, Round, Timer, ContentWrapper } from './Room.styles';
import { Room } from '@teikna/interfaces';
import Users from './Users';
import Container from '../../components/Container';
import useRoomSocket from '../../hooks/useRoomSocket';
import { SocketContext } from '../../context';
import { UserContext } from '../../context';
import { User } from '@teikna/interfaces';
import Messages from './Chat';

const ChatRoom = () => {
  const { roomId } = useParams<RoomRouteParams>();
  const { socket, user, room } = useRoomSocket(roomId);

  if (!socket || !user || !room) {
    return <div>Loading or failure</div>;
  }

  return (
    <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
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
      </SocketContext.Provider>
    </UserContext.Provider>
  );
};

export default ChatRoom;
