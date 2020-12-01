import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { Room, User } from '@teikna/interfaces';

export const SocketContext = createContext<Socket>({} as Socket);

export const UserContext = createContext<User>({} as User);

export const RoomContext = createContext<Room>({} as Room);
