import { RoomEvent } from '@teikna/enums';
import { Room } from '@teikna/interfaces';
import { round } from 'lodash';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Container from '../../components/Container';
import { RoomContext, SocketContext, UserContext } from '../../context';
import useRoomSocket from '../../hooks/useRoomSocket';
import useSocketChat from '../../hooks/useSocketChat';
import { RoomRouteParams } from '../../router';
import ChatRoom from '../Room';
import {
  Player,
  PlayerContainer,
  SelectInput,
  SelectLabel,
  SelectWrapper,
  SettingsCard,
  SettingsTitle,
  StartGameButton,
  TextInput,
} from './lobby.styles';

const Lobby = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [roundCount, setRoundCount] = useState(3);
  const [drawingTime, setDrawingTime] = useState(50);
  const [copyLink, setCopyLink] = useState('');

  const [gameStarted, setGameStarted] = useState(false);

  const { roomId } = useParams<RoomRouteParams>();
  const { socket, user, room } = useRoomSocket(roomId);

  useEffect(() => {
    if (room && user) {
      setIsAdmin(user.id === room.adminUserId);
    }
  }, [room, user]);

  useEffect(() => {
    if (room) {
      setCopyLink(`localhost:4200/room/${room.id}`);
      /** if user isn't admin, these changes are recieved through socket */
      if (!isAdmin) {
        setRoundCount(room.roundLimit);
        setDrawingTime(room.drawTime);
        setGameStarted(room.hasGameStarted);
      }
    }
  }, [room]);

  const handleRoundLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedRoundcount = Number(event.target.value);
    if (room) {
      const updatedRoom: Room = { ...room, roundLimit: updatedRoundcount };
      socket.emit(RoomEvent.UPDATEROOM, updatedRoom);
      setRoundCount(updatedRoundcount);
    }
  };

  const handleDrawTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedDrawtime = Number(event.target.value);
    if (room) {
      const updatedRoom: Room = { ...room, drawTime: updatedDrawtime };
      socket.emit(RoomEvent.UPDATEROOM, updatedRoom);
      setDrawingTime(updatedDrawtime);
    }
  };

  const handleStartGame = () => {
    if (room) {
      const updatedRoom: Room = { ...room, hasGameStarted: true };
      socket.emit(RoomEvent.UPDATEROOM, updatedRoom);
      setGameStarted(true);
    }
  };

  if (!room) {
    return <div>crapper! no room!</div>;
  }

  if (gameStarted && user) {
    return (
      <RoomContext.Provider value={room}>
        <UserContext.Provider value={user}>
          <SocketContext.Provider value={socket}>
            <ChatRoom />
          </SocketContext.Provider>
        </UserContext.Provider>
      </RoomContext.Provider>
    );
  }

  // if (room) {
  //   if (room.hasGameStarted) {
  //     return <ChatRoom roomId={room.id} />;
  //   }
  // }

  return (
    <Container>
      <SettingsCard isAdmin={isAdmin}>
        <SettingsTitle>Lobby</SettingsTitle>
        <SelectWrapper>
          <SelectLabel>Rounds</SelectLabel>
          <SelectInput name="roundCount" disabled={!isAdmin} onChange={handleRoundLimitChange} value={roundCount}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </SelectInput>
        </SelectWrapper>
        <SelectWrapper>
          <SelectLabel>Draw time</SelectLabel>
          <SelectInput name="drawTime" disabled={!isAdmin} onChange={handleDrawTimeChange} value={drawingTime}>
            <option value={30}>30 seconds</option>
            <option value={40}>40 seconds</option>
            <option value={50}>50 seconds</option>
            <option value={60}>60 seconds</option>
          </SelectInput>
        </SelectWrapper>
        <StartGameButton disabled={!isAdmin} onClick={handleStartGame}>
          Start game
        </StartGameButton>
      </SettingsCard>
      <PlayerContainer>
        {Object.values(room.users).map((user) => (
          <Player key={user.id}>{user.name}</Player>
        ))}
      </PlayerContainer>
      <button onClick={() => navigator.clipboard.writeText(copyLink)}>click me to copy link!</button>
    </Container>
  );
};

export default Lobby;
