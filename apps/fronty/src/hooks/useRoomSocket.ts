import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageEvent, RoomEvent } from '@teikna/enums';
import { Room, User } from '@teikna/interfaces';

const SOCKET_SERVER_URL = 'http://localhost:8080/';

const useRoomSocket = (roomId: string) => {
  const [socket] = useState<Socket>(io(SOCKET_SERVER_URL));
  const [user, setUser] = useState<User>();
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    socket.on(RoomEvent.CONNECT, () => {
      const user: User = {
        id: socket.id,
        name: localStorage.getItem('name') ?? 'Userino',
        roomId: roomId,
        score: 0,
        hasGuessedWord: false,
        hasDrawnInCurrentRound: false,
      };

      if (roomId) {
        socket.emit(RoomEvent.JOINROOM, user);
        setUser(user);
      } else {
        console.log('creating room in client');
        socket.emit(RoomEvent.CREATEROOM, user);
      }

      socket.on(RoomEvent.ROOMINFO, (roomInfo: Room) => {
        setUser({ ...user, roomId: roomInfo.id });
        setRoom(roomInfo);
      });
    });

    // Disconnect socket when hook unmounts
    return () => {
      console.log('disconnecting socket inside useRoomSocket hook');
      socket.disconnect();
    };
  }, [socket]);

  return { socket, user, room };
};

export default useRoomSocket;
