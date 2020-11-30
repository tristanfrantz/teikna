import { useContext, useEffect, useState } from 'react';
import { UserContext, SocketContext } from '../context';
import { MessageEvent } from '@teikna/enums';
import { Message } from '@teikna/interfaces';

const useSocketChat = () => {
  const user = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
      socket.on(MessageEvent.MESSAGE, (message: Message) => {
        console.log('inside on message', message);
        setMessages((messages) => [...messages, message]);
      });
  }, []);

  const sendMessage = (content: string) => {
    const message: Message = { user, content };
    socket.emit(MessageEvent.MESSAGE, message);
    console.log('sending message', message);
    setMessages((messages) => [...messages, message]);
  };

  return { messages, sendMessage };
};

export default useSocketChat;
