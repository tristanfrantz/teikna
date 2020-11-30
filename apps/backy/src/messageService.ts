import { MessageEvent, MessageType, RoomEvent } from '@teikna/enums';
import { DrawData, Message, Room, User } from '@teikna/interfaces';
import { MessageModel } from '@teikna/models';
import { Socket, Server } from 'socket.io';

export class MessageService {
  private ioServer: Server;

  constructor(ioServer: Server) {
    this.ioServer = ioServer;
  }

  public emitUserJoined = (user: User, socket: Socket, room: Room) => {
    const { name, id } = user;
    const content = `${name} has joined the room`;
    const userJoinedMessage = new MessageModel(user, content, MessageType.SERVERMESSAGE);
    socket.to(user.room).broadcast.emit(MessageEvent.MESSAGE, userJoinedMessage);
    socket.emit(RoomEvent.JOINROOM, room);
  };

  public emitUserLeft = (user: User, socket: Socket) => {
    const { name, room } = user;
    const content = `${name} has left the room`;
    const userLeftMessage = new MessageModel(user, content, MessageType.SERVERMESSAGE);
    socket.to(room).broadcast.emit(MessageEvent.MESSAGE, userLeftMessage);
  };

  public emitUserList = (userList: User[], room: string) => {
    this.ioServer.to(room).emit(MessageEvent.USERLIST, userList);
  };

  public emitMessage = (message: Message, socket: Socket) => {
    const { user, content } = message;
    const messageContent = new MessageModel(user, content, MessageType.USERMESSAGE);
    socket.to(user.room).broadcast.emit(MessageEvent.MESSAGE, messageContent);
  };

  /** these next 3 are server messages, user set to null since we dont want any user to send these */
  public emitRoundEndMessage = (room: string, correctWord: string) => {
    const content = `The word was '${correctWord}'`;
    const messageContent = new MessageModel(null, content, MessageType.SERVERMESSAGE);
    this.ioServer.to(room).emit(MessageEvent.MESSAGE, messageContent);
  };

  public emitCorrectGuess = (user: User) => {
    const { name, room } = user;
    const content = `${name} has guessed the word!`;
    const correctGuessMessage = new MessageModel(null, content, MessageType.SERVERMESSAGE);
    this.ioServer.to(room).emit(MessageEvent.CORRECTGUESS, correctGuessMessage);
  };

  public emitCloseGuess = (message: Message, socket: Socket) => {
    const { content, user } = message;
    const messageContent = `'${content}' is close!`;
    const closeGuessMessage = new MessageModel(null, messageContent, MessageType.PRIVATEMESSAGE);
    socket.to(user.id).emit(MessageEvent.CLOSEGUESS, closeGuessMessage);
  };

  public emitWordsToUser = (words: string[], userId: string) => {
    this.ioServer.to(userId).emit(MessageEvent.WORDLIST, words);
  };

  public emitDrawing = (drawData: DrawData, socket: Socket) => {
    socket.to(drawData.room).broadcast.emit(MessageEvent.DRAW, drawData);
  };
}
