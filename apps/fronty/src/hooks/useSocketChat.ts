import { useContext, useEffect, useState } from 'react';
import { UserContext, SocketContext } from '../context';
import { MessageEvent, MessageType } from '@teikna/enums';
import { Message } from '@teikna/interfaces';
import { formatMessage } from '../utils';

const useSocketChat = () => {
  const user = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGuessedWord, setHasGuessedWord] = useState(false);

  useEffect(() => {
    socket.on(MessageEvent.MESSAGE, (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on(MessageEvent.CORRECTGUESS, (message: Message) => {
      setHasGuessedWord(true);
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessage = (content: string) => {
    const formattedMessage: Message = formatMessage({ user, content, type: MessageType.USERMESSAGE });
    socket.emit(MessageEvent.MESSAGE, formattedMessage);
    setMessages((messages) => [...messages, formattedMessage]);
  };

  return { messages, sendMessage, hasGuessedWord };
};

export default useSocketChat;
