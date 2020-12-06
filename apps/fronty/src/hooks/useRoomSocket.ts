import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { RoomEvent } from '@teikna/enums';
import { Room, User } from '@teikna/interfaces';
import { useStore } from '@teikna/store';

const SOCKET_SERVER_URL = 'http://localhost:8080/';

const useRoomSocket = (roomId: string) => {
  const [socket] = useState<Socket>(io(SOCKET_SERVER_URL));
  const { setWordList: setWordlist, setUser, setRoom } = useStore();

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
        socket.emit(RoomEvent.CREATEROOM, user);
      }

      socket.on(RoomEvent.ROOMINFO, (roomInfo: Room) => {
        /** TODO: fix this, should only set user if user created room */
        setUser({ ...user, roomId: roomInfo.id });
        setRoom(roomInfo);
      });

      socket.on(RoomEvent.WORDLIST, (words: string[]) => {
        setWordlist(words);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};

export default useRoomSocket;
