import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { User } from '@teikna/interfaces';

export const SocketContext = createContext<Socket>({} as Socket);

export const UserContext = createContext<User>({} as User);
