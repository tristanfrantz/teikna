import { createServer, Server as HttpServer } from 'http';
import express from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { RoomEvent, MessageEvent, CanvasEvent } from '@teikna/enums';
import { DrawData, Message, Room, User } from '@teikna/interfaces';
import { delay } from 'lodash';

import { RoomService } from './roomService';
import cors from 'cors';

import * as messageUtils from './utils';
import { differenceInSeconds } from 'date-fns';

import * as cron from 'node-cron';

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

      /** every second */
      cron.schedule('* * * * * *', () => {
        this.checkForTurnEndInRooms();
      });
    });

    this.io.on(RoomEvent.CONNECT, (socket: Socket) => {
      socket.on(RoomEvent.JOINROOM, (user: User) => {
        socket.join(user.roomId);
        this.users[socket.id] = user;

        const userJoinedMessage = messageUtils.userJoinedMessage(user);
        socket.to(user.roomId).broadcast.emit(MessageEvent.MESSAGE, userJoinedMessage);

        this.roomService.joinRoom(user);
        this.emitRoomInfo(user.roomId);
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
        this.emitRoomInfo(room.id);
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
              this.emitRoomInfo(room.id);
            } else if (messageSimilarity >= 0.8) {
              const closeGuessMessage = messageUtils.closeGuessMessage(message);
              const userMessage = messageUtils.userMessage(message);

              socket.to(room.id).broadcast.emit(MessageEvent.MESSAGE, userMessage);
              socket.emit(MessageEvent.MESSAGE, closeGuessMessage);
            } else {
              const userMessage = messageUtils.userMessage(message);
              socket.to(room.id).broadcast.emit(MessageEvent.MESSAGE, userMessage);
            }
          }
        }
      });

      socket.on(CanvasEvent.DRAW, (data: DrawData) => {
        const user = this.users[socket.id];
        if (!user) {
          return;
        }
        const { roomId } = user;
        this.roomService.handleDraw(data, roomId);
        socket.to(user.roomId).emit(CanvasEvent.DRAW, data);
      });

      socket.on(RoomEvent.DISCONNECT, () => {
        const user = this.users[socket.id];
        if (user) {
          this.roomService.leaveRoom(user);
          const userLeaveMessage = messageUtils.userLeftMessage(user);

          this.io.to(user.roomId).emit(MessageEvent.MESSAGE, userLeaveMessage);
          this.emitRoomInfo(user.roomId);
        }
      });

      /** sent by lobby owner when he presses start game, emits three words to drawer */
      socket.on(RoomEvent.STARTGAME, () => {
        const user = this.users[socket.id];
        if (user) {
          this.roomService.handleStartGame(user.roomId);
          this.emitRoomInfo(user.roomId);
          this.emitThreeRandomWords(user.roomId);
        }
      });

      socket.on(RoomEvent.SELECTWORD, (roomId: string, word: string) => {
        const user = this.users[socket.id];
        if (user) {
          this.roomService.handleSelectWord(roomId, word, user.id);
          this.emitRoomInfo(roomId);
        }
      });
    });
  }

  private checkForTurnEndInRooms = () => {
    const rooms = this.roomService.getRoomList();
    rooms.forEach((room) => {
      if (room.isUserDrawing) {
        const hasEveryUserGuessed = this.roomService.hasEveryUserGuessed(room.id);
        const dateNow = new Date();
        const isDrawingTimeExpired = differenceInSeconds(dateNow, new Date(room.turn.startDateTime)) === room.drawTime;
        if (hasEveryUserGuessed || isDrawingTimeExpired) {
          console.log('turn should end, updating room and emitting now');
          this.roomService.handleTurnEnd(room.id);

          this.emitTurnEnd(room.id);
          this.emitRoomInfo(room.id);
          this.emitThreeRandomWords(room.id);
        }
      }
    });
  };

  private emitThreeRandomWords = (roomId: string) => {
    const room = this.roomService.getRoom(roomId);
    console.log('about to emit words to ', room.drawingUser.name);
    if (room) {
      const threeRandomWords = this.roomService.getThreeRandomWords();
      this.io.to(room.drawingUser.id).emit(RoomEvent.WORDLIST, threeRandomWords);
    } else {
      console.log('didnt find a room :(');
    }
  };

  private emitTurnEnd = (roomId: string) => {
    const room = this.roomService.getRoom(roomId);
    if (room) {
      const turnEndMessage = messageUtils.turnEndMessage(room.correctGuess);
      this.io.to(room.id).emit(MessageEvent.MESSAGE, turnEndMessage);
      this.io.to(room.id).emit(RoomEvent.TURNEND);
      this.io.to(room.id).emit(CanvasEvent.CLEAR);
    }
  };

  private emitRoomInfo = (roomId: string) => {
    const room = this.roomService.getRoom(roomId);
    if (room) {
      this.io.to(room.id).emit(RoomEvent.ROOMINFO, room);
    }
  };
}
