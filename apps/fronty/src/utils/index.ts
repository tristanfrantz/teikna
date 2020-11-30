import { Message } from '@teikna/interfaces';

export const formatMessage = (message: Omit<Message, 'timestamp'>) => {
  const formattedMessage: Message = { ...message, timestamp: new Date() };
  return formattedMessage;
};
