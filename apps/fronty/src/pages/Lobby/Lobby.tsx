import { Loading } from '@teikna/components/Loading';
import { RoomEvent } from '@teikna/enums';
import { Room } from '@teikna/interfaces';
import { useStore } from '@teikna/store';
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
  const socket = useRoomSocket(roomId);
  const { room, user } = useStore();

  useEffect(() => {
    if (room && user) {
      setIsAdmin(user.id === room.adminUserId);
    }
  }, [room, user]);

  useEffect(() => {
    if (room) {
      setCopyLink(`localhost:4200/room/${room.id}`);
      setRoundCount(room.roundLimit);
      setDrawingTime(room.drawTime);
      setGameStarted(!room.isGameInLobby);
    }
  }, [room]);

  const handleRoundLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedRoundcount = Number(event.target.value);
    if (room) {
      const updatedRoom: Room = { ...room, roundLimit: updatedRoundcount };
      socket.emit(RoomEvent.UPDATEROOM, updatedRoom);
    }
  };

  const handleDrawTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedDrawtime = Number(event.target.value);
    if (room) {
      const updatedRoom: Room = { ...room, drawTime: updatedDrawtime };
      socket.emit(RoomEvent.UPDATEROOM, updatedRoom);
    }
  };

  const handleStartGame = () => {
    if (room) {
      socket.emit(RoomEvent.STARTGAME);
    }
  };

  if (!room) {
    return <Loading />;
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

  return (
    <Container>
      <SettingsCard isAdmin={isAdmin}>
        <SettingsTitle>Lobby</SettingsTitle>
        <SelectWrapper>
          <SelectLabel>Rounds</SelectLabel>
          <SelectInput name="roundCount" disabled={!isAdmin} onChange={handleRoundLimitChange} value={roundCount}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </SelectInput>
        </SelectWrapper>
        <SelectWrapper>
          <SelectLabel>Draw time</SelectLabel>
          <SelectInput name="drawTime" disabled={!isAdmin} onChange={handleDrawTimeChange} value={drawingTime}>
            <option value={30}>30 seconds</option>
            <option value={40}>40 seconds</option>
            <option value={50}>50 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={70}>70 seconds</option>
            <option value={80}>80 seconds</option>
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
