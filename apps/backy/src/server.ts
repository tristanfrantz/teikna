import { createServer, Server as HttpServer } from 'http';
import express from 'express';
import { Server as SocketServer, Socket } from 'socket.io';
import { RoomEvent, MessageEvent } from '@teikna/enums';
import { DrawData, Message, Room, User } from '@teikna/interfaces';
import { compareTwoStrings } from 'string-similarity';
import * as words from './words.json';

export default class ChatServer {
  private port = 8080;
  private app: express.Application;
  private io: SocketServer;
  private server: HttpServer;
  private users: Record<string, User> = {};
  private rooms: Record<string, Room> = {};
  private wordList: string[] = words;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server, { cors: { origin: '*' } });
    this.listen();
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(RoomEvent.CONNECT, (socket: Socket) => {
      console.log('someone connected');
      socket.on(RoomEvent.JOINROOM, (user: User) => {

        console.log('user joining', user);
        socket.join(user.room);
        const message: Message = {
          content: `${user.name} has joined the room`,
          user,
        };
        socket.to(user.room).broadcast.emit(MessageEvent.MESSAGE, message);

        this.users[socket.id] = user;
        /** this causing a crashy */
        if (this.rooms[user.room]) {
          this.rooms[user.room].users[user.id] = user;
        } else {
          this.rooms[user.room] = {
            id: user.room,
            users: { [user.id]: user },
            currentRound: 0,
            wordListId: '',
            selectedWord: '',
            roundCount: 1,
            selectedUser: user,
          };
        }

        /** after user joins, update user list for connected clients */
        const usersInRoom = Object.values(this.users).filter((u) => u.room === user.room);
        socket.to(user.room).emit(MessageEvent.USERLIST, JSON.stringify(usersInRoom));
      });

      socket.on(MessageEvent.MESSAGE, (message: Message) => {
        const { user, content } = message;

        const room = this.rooms[user.room];
        if (room) {
          const selectedWord = room.selectedWord;

          if (selectedWord === content) {
            room.users[user.id].hasGuessedWord = true;
            room.users[user.id].score += 100;

            socket.to(user.room).emit(MessageEvent.CORRECTGUESS, `${user.name} has guessed the word!`);
          } else if (compareTwoStrings(selectedWord, content) >= 0.8) {
            socket.to(user.id).emit(MessageEvent.CLOSEGUESS, `'${content}' is close!`);
          } else {
            console.log('im emitting a message here');
            socket.to(user.room).broadcast.emit(MessageEvent.MESSAGE, message);
          }
        }
      });

      socket.on(MessageEvent.DRAW, (data: DrawData) => {
        const user = this.users[socket.id];
        if (user) {
          socket.to(user.room).broadcast.emit(MessageEvent.DRAW, data);
        }
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
        console.log("disconnecting");
        const user = this.users[socket.id];
        if (user) {
            const room = this.rooms[user.room];
          if (room) {
            socket.to(user.room).emit(MessageEvent.USERLIST, JSON.stringify(room.users));
            socket.to(user.room).emit(MessageEvent.MESSAGE, `${user.name} has left the room, what a gook!`);
    
            delete room.users[socket.id];
            delete this.users[socket.id];
          }
        }
      });

      /** who the hell emits this event ?  drawer ? */
      socket.on(RoomEvent.ROUNDEND, (roomId: string) => {
        /** notify users what the correct word was */
        /** update user list for new scores */
        /** pick a user that gets to draw */
        /** give user 3 random words */

        const room = this.rooms[roomId];
        const userList = Object.values(room.users).map((user) => user);
        const indexOfLastDrawer = userList.findIndex((user) => user.id === room.selectedUser.id);
        if (indexOfLastDrawer !== -1) {
          /** check if its the last index of the user list, then need to emit a new round event or smthn */
          /** set next index to the active user */
        }

        socket.to(roomId).emit(MessageEvent.MESSAGE, `The word was '${room.selectedWord}'`);
        socket.to(roomId).emit(MessageEvent.USERLIST, JSON.stringify(userList));

        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * Math.floor(this.wordList.length));
          words.push(this.wordList[randomIndex]);
        }
      });

      socket.on(RoomEvent.ROUNDSTART, () => {});
    });
  }
}
