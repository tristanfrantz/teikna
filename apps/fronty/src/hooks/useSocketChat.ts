import { useContext, useEffect, useState } from 'react';
import { UserContext, SocketContext } from '../context';
import { MessageEvent } from '@teikna/enums';
import { Message } from '@teikna/interfaces';
import { formatMessage } from '../utils';

const useSocketChat = () => {
  const user = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on(MessageEvent.MESSAGE, (message: Message) => {
      setMessages((messages) => [...messages, formatMessage(message)]);
    });
  }, []);

  const sendMessage = (content: string) => {
    const formattedMessage: Message = formatMessage({ user, content });
    socket.emit(MessageEvent.MESSAGE, formattedMessage);
    setMessages((messages) => [...messages, formattedMessage]);
  };

  return { messages, sendMessage };
};

export default useSocketChat;
