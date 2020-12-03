import { createServer, Server as HttpServer } from 'http';
import express from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { RoomEvent, MessageEvent } from '@teikna/enums';
import { DrawData, Message, Room, User } from '@teikna/interfaces';

import { RoomService } from './roomService';
import cors from 'cors';

import * as messageUtils from './utils';
import { correctGuessMessage } from './utils';
import { TurnModel } from '@teikna/models';

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
        this.users[socket.id] = user;

        const userJoinedMessage = messageUtils.userJoinedMessage(user);
        socket.to(user.roomId).broadcast.emit(MessageEvent.MESSAGE, userJoinedMessage);

        this.roomService.joinRoom(user);
        const room = this.roomService.getRoom(user.roomId);
        this.io.to(user.roomId).emit(RoomEvent.ROOMINFO, room);
      });

      socket.on(RoomEvent.CREATEROOM, (user: User) => {
        this.roomService.createRoom(user);
        const createdRoom = this.roomService.getRoom(user.roomId);
        socket.join(createdRoom.id);
        this.users[socket.id] = user;

        socket.emit(RoomEvent.ROOMINFO, createdRoom);
      });

      socket.on(RoomEvent.UPDATEROOM, (room: Room) => {
        this.roomService.updateRoom(room);
        const updatedRoom = this.roomService.getRoom(room.id);
        this.io.to(room.id).emit(RoomEvent.ROOMINFO, updatedRoom);
      });

      socket.on(MessageEvent.MESSAGE, (message: Message) => {
        const { content, user } = message;
        if (user) {
          const room = this.roomService.getRoom(user.roomId);
          if (room) {
            const messageSimilarity = messageUtils.checkMessageSimilarity(room.correctGuess, content);
            if (messageSimilarity === 1) {
              const correctGuessMessage = messageUtils.correctGuessMessage(user);
              this.io.to(room.id).emit(MessageEvent.MESSAGE, correctGuessMessage);

              this.roomService.handleCorrectGuess(room.id, user.id);
              const updatedRoom = this.roomService.getRoom(room.id);
              this.io.to(room.id).emit(RoomEvent.ROOMINFO, updatedRoom);
            } else if (messageSimilarity >= 0.8) {
              const closeGuessMessage = messageUtils.closeGuessMessage(message);
              socket.emit(MessageEvent.MESSAGE, closeGuessMessage);
            } else {
              const userMessage = messageUtils.userMessage(message);
              socket.to(room.id).broadcast.emit(MessageEvent.MESSAGE, userMessage);
            }
          }
        }
      });

      socket.on(MessageEvent.DRAW, (data: DrawData) => {
        // this.roomService.handleDraw(data, socket);
      });

      socket.on(RoomEvent.DISCONNECT, () => {
        const user = this.users[socket.id];
        if (user) {
          this.roomService.leaveRoom(user);
          const updatedRoom = this.roomService.getRoom(user.roomId);
          const userLeaveMessage = messageUtils.userLeftMessage(user);

          this.io.to(user.roomId).emit(MessageEvent.MESSAGE, userLeaveMessage);
          this.io.to(user.roomId).emit(RoomEvent.ROOMINFO, updatedRoom);
        }
      });

      /** sent by current drawer to current drawer, generate three random words to choose from */
      socket.on(RoomEvent.STARTGAME, () => {
        const threeRandomWords = this.roomService.getThreeRandomWords();
        socket.emit(RoomEvent.WORDLIST, threeRandomWords);
      });

      /** pick next drawing user or handle round increment, emit new room info to users */
      socket.on(RoomEvent.TURNEND, () => {
        const user = this.users[socket.id];
        if (user) {
          this.roomService.handleTurnEnd(user.roomId);
          const updatedRoom = this.roomService.getRoom(user.roomId);
          const correctWordMessage = messageUtils.correctWordMessage(updatedRoom.correctGuess);

          this.io.to(user.roomId).emit(MessageEvent.MESSAGE, correctWordMessage);
          this.io.to(user.roomId).emit(RoomEvent.ROOMINFO, updatedRoom);
        }
      });

      socket.on(RoomEvent.SELECTWORD, (roomId: string, word: string) => {
        const user = this.users[socket.id];
        if (user) {
          this.roomService.handleSelectWord(roomId, word, user.id);
          const updatedRoom = this.roomService.getRoom(roomId);

          this.io.to(roomId).emit(RoomEvent.ROOMINFO, updatedRoom);
        }
      });
    });
  }
}
