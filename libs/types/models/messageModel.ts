import { Message, User } from '@teikna/interfaces';
import { MessageType } from '@teikna/enums';

export class MessageModel implements Message {
  user: User | null;
  content: string;
  type: MessageType;
  timestamp: Date;
  constructor(user: User | null, content: string, type: MessageType) {
    this.user = user;
    this.content = content;
    this.type = type;
    this.timestamp = new Date();
  }
}
