import React from 'react';
import { useParams } from 'react-router-dom';
import DrawingBoard from './DrawingBoard';
import { RoomRouteParams } from '../../router';
import { CanvasWrapper, RoomWrapper, Header, Round, Timer, ContentWrapper } from './Room.styles';
import { Room } from '@teikna/interfaces';
import { Users } from './UserList';
import Container from '../../components/Container';
import useRoomSocket from '../../hooks/useRoomSocket';
import { SocketContext } from '../../context';
import { UserContext } from '../../context';
import { User } from '@teikna/interfaces';
import Messages from './Chat';

const users: User[] = [
  {
    id: '1',
    name: 'User1',
    score: 5060,
    img: 'https://assets.change.org/photos/6/iy/iv/OMIYIvOcNvINScL-800x450-noPad.jpg?1595872321',
    hasGuessedWord: false,
    room: "bingo"
  },
  {
    id: '1',
    name: 'User2',
    score: 4250,
    img: 'https://assets.change.org/photos/6/iy/iv/OMIYIvOcNvINScL-800x450-noPad.jpg?1595872321',
    hasGuessedWord: true,
    room: "bingo"
  },
  {
    id: '1',
    name: 'User3',
    score: 9520,
    img: 'https://assets.change.org/photos/6/iy/iv/OMIYIvOcNvINScL-800x450-noPad.jpg?1595872321',
    hasGuessedWord: false,
    room: "bingo"
  },
  {
    id: '1',
    name: 'User4',
    score: 100,
    img: 'https://assets.change.org/photos/6/iy/iv/OMIYIvOcNvINScL-800x450-noPad.jpg?1595872321',
    hasGuessedWord: false,
    room: "bingo"
  },
  {
    id: '1',
    name: 'User5',
    score: 2313,
    img: 'https://assets.change.org/photos/6/iy/iv/OMIYIvOcNvINScL-800x450-noPad.jpg?1595872321',
    hasGuessedWord: true,
    room: "bingo"
  },
];

const mockRoom: Room = {
  id: '',
  users: {},
  wordListId: '',
  selectedWord: 'poopy',
  selectedUser: users[1],
  roundCount: 4,
  currentRound: 2,
};

const ChatRoom = () => {
  const { roomId } = useParams<RoomRouteParams>();
  const { socket, user } = useRoomSocket(roomId);

  if (!socket || !user) {
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
              <Round>{`Round ${mockRoom.currentRound} of ${mockRoom.roundCount}`}</Round>
            </Header>
            <ContentWrapper>
              <Users users={users} />
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
