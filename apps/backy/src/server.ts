import { createServer, Server as HttpServer } from 'http';
import express from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { RoomEvent, MessageEvent } from '@teikna/enums';
import { DrawData, Message, Room, User } from '@teikna/interfaces';

import { RoomService } from './roomService';
import cors from 'cors';

export default class ChatServer {
  private port = 8080;
  private app: express.Application;
  private io: SocketServer;
  private server: HttpServer;
  private users: Record<string, User> = {};

  private roomService: RoomService;

  constructor() {
    this.app = express();
    this.app.use(cors({ origin: '*' }));
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server, { cors: { origin: '*' } });
    this.listen();
    this.roomService = new RoomService(this.io);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(RoomEvent.CONNECT, (socket: Socket) => {
      console.log('someone connected');

      socket.on(RoomEvent.JOINROOM, (user: User) => {
        socket.join(user.room);
        this.users[socket.id] = user;
        this.roomService.joinRoom(user, socket);
      });

      socket.on(RoomEvent.CREATEROOM, (room: Room) => {
        this.roomService.createRoom(room);
      });

      socket.on(MessageEvent.MESSAGE, (message: Message) => {
        this.roomService.handleMessage(message, socket);
      });

      socket.on(MessageEvent.DRAW, (data: DrawData) => {
        this.roomService.handleDraw(data, socket);
      });

      // TODO FUNCS
      // socket.on(ChatEvent.FILL, (data: DrawData) => {
      //   const { user } = data;
      //   socket.to(user.room).broadcast.emit(ChatEvent.FILL, JSON.stringify(data));
      // });

      // socket.on(ChatEvent.ERASE, (data: DrawData) => {
      //   const drawData: DrawData = { ...data, color: 'white' };
      //   const { user } = data;
      //   socket.to(user.room).broadcast.emit(ChatEvent.ERASE, JSON.stringify(drawData));
      // });

      // socket.on(ChatEvent.CLEAR, (user: User) => {
      //   socket.to(user.room).broadcast.emit(ChatEvent.CLEAR);
      // });

      socket.on(RoomEvent.DISCONNECT, () => {
        console.log('disconnecting');
        const user = this.users[socket.id];
        if (user) {
          this.roomService.leaveRoom(user, socket);
        }
      });

      /** who the hell emits this event ?  drawer ? */
      socket.on(RoomEvent.ROUNDEND, (room: string) => {
        this.roomService.handleRoundEnd(room);
      });

      socket.on(RoomEvent.ROUNDSTART, (room: string) => {
        this.roomService.handleRoundStart(room);
      });

      socket.on(RoomEvent.SELECTWORD, (roomId: string, word: string) => {
        this.roomService.handleSelectWord(roomId, word);
      });
    });
  }
}
