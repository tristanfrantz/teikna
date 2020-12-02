import { MessageType } from '@teikna/enums';
import { Message, User } from '@teikna/interfaces';
import { MessageModel } from '@teikna/models';
import { compareTwoStrings } from 'string-similarity';

export const userJoinedMessage = (user: User) => {
  const { name } = user;
  const content = `${name} has joined the room`;
  const userJoinedMessage = new MessageModel(user, content, MessageType.SERVERMESSAGE);
  return userJoinedMessage;
};

export const userLeftMessage = (user: User) => {
  const { name } = user;
  const content = `${name} has left the room`;
  const userLeftMessage = new MessageModel(user, content, MessageType.SERVERMESSAGE);
  return userLeftMessage;
};

export const userMessage = (message: Message) => {
  const { content } = message;
  const messageContent = new MessageModel(undefined, content, MessageType.USERMESSAGE);
  return messageContent;
};

/** these next 3 are server messages, user set to null since we dont want any user to send these */
export const roundEndMessage = (correctWord: string) => {
  const content = `The word was '${correctWord}'`;
  const messageContent = new MessageModel(undefined, content, MessageType.SERVERMESSAGE);
  return messageContent;
};

export const correctGuessMessage = (user: User) => {
  const { name } = user;
  const content = `${name} has guessed the word!`;
  const correctGuessMessage = new MessageModel(undefined, content, MessageType.SERVERMESSAGE);
  return correctGuessMessage;
};

export const closeGuessMessage = (message: Message) => {
  const { content } = message;
  const messageContent = `'${content}' is close!`;
  const closeGuessMessage = new MessageModel(undefined, messageContent, MessageType.PRIVATEMESSAGE);
  return closeGuessMessage;
};

export const checkMessageSimilarity = (correctMessage: string, message: string) => {
  return compareTwoStrings(correctMessage, message);
};
