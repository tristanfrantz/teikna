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
        room: roomId,
        score: 0,
        hasGuessedWord: false,
      };
      socket.emit(RoomEvent.JOINROOM, user);
      setUser(user);

      socket.on(RoomEvent.JOINROOM, (room: Room) => {
        console.log('recieved this room: ', room);
        setRoom(room);
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
