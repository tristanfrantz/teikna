import { createServer, Server as HttpServer } from 'http';
import express from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { RoomEvent, MessageEvent } from '@teikna/enums';
import { DrawData, Message, Room, User } from '@teikna/interfaces';

import { RoomService } from './roomService';
import cors from 'cors';

import * as messageUtils from './utils';

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
    this.roomService = new RoomService();
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(RoomEvent.CONNECT, (socket: Socket) => {
      socket.on(RoomEvent.JOINROOM, (user: User) => {
        socket.join(user.roomId);
        this.users[user.id] = user;

        const userJoinedMessage = messageUtils.userJoinedMessage(user);
        socket.to(user.roomId).broadcast.emit(MessageEvent.MESSAGE, userJoinedMessage);

        const room = this.roomService.joinRoom(user);
        this.io.to(user.roomId).emit(RoomEvent.ROOMINFO, room);
      });

      socket.on(RoomEvent.CREATEROOM, (user: User) => {
        const createdRoom = this.roomService.createRoom(user);
        socket.join(createdRoom.id);
        socket.emit(RoomEvent.ROOMINFO, createdRoom);
      });

      socket.on(RoomEvent.UPDATEROOM, (room: Room) => {
        const updatedRoom = this.roomService.updateRoom(room);
        this.io.to(room.id).emit(RoomEvent.ROOMINFO, updatedRoom);
      });

      socket.on(MessageEvent.MESSAGE, (message: Message) => {
        const { content, user } = message;
        const room = this.roomService.getRoom(user.roomId);
        if (room) {
          const messageSimilarity = messageUtils.checkMessageSimilarity(room.correctGuess, content);
          if (messageSimilarity === 1) {
            const correctGuessMessage = messageUtils.correctGuessMessage(user);
            socket.to(room.id).broadcast.emit(MessageEvent.MESSAGE, correctGuessMessage);
          } else if (messageSimilarity >= 0.8) {
            const closeGuessMessage = messageUtils.closeGuessMessage(message);
            socket.emit(MessageEvent.CLOSEGUESS, closeGuessMessage);
          } else {
            const userMessage = messageUtils.userMessage(message);
            socket.to(room.id).broadcast.emit(MessageEvent.MESSAGE, userMessage);
          }
        }
      });

      socket.on(MessageEvent.DRAW, (data: DrawData) => {
        // this.roomService.handleDraw(data, socket);
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
        const user = this.users[socket.id];
        if (user) {
          this.roomService.leaveRoom(user);
          const updatedRoomInfo = this.roomService.getRoom(user.roomId);
          const userLeaveMessage = messageUtils.userLeftMessage(user);
          socket.to(user.roomId).broadcast.emit(MessageEvent.MESSAGE, userLeaveMessage);
          this.io.to(user.roomId).emit(RoomEvent.ROOMINFO, updatedRoomInfo);
        }
      });

      /** who the hell emits this event ?  drawer ? */
      socket.on(RoomEvent.ROUNDEND, (room: string) => {
        // this.roomService.handleRoundEnd(room);
      });

      socket.on(RoomEvent.ROUNDSTART, (roomId: string) => {
        const room = this.roomService.getRoom(roomId);
        if (room) {
          this.roomService.handleRoundStart(roomId);
          const threeRandomWords = this.roomService.getThreeRandomWords();
          socket.to(room.drawingUser.id).emit(MessageEvent.WORDLIST, threeRandomWords);
        }
      });

      socket.on(RoomEvent.SELECTWORD, (roomId: string, word: string) => {
        this.roomService.handleSelectWord(roomId, word);
      });
    });
  }
}
