import React, { KeyboardEvent, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import useSocketChat from '../../hooks/useSocketChat';
import { Message } from '@teikna/interfaces';
import {
  MessageContent,
  MessageInput,
  MessageItem,
  MessageList,
  MessageSender,
  MessageWrapper,
} from './Room.styles';

const Chat = () => {
  const { messages, sendMessage } = useSocketChat();
  const { handleSubmit } = useForm();
  const [newMessage, setNewMessage] = React.useState('');

  const handleNewMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <MessageWrapper>
      <MessageList>
        {messages.map((message: Message) => {
          const { user, content, timestamp } = message;
          return (
            <MessageItem key={timestamp.getTime()}>
              <div>
                <MessageSender>{`${
                  user?.name ?? 'some ugly dude'
                }: `}</MessageSender>
                <MessageContent>{content}</MessageContent>
              </div>
            </MessageItem>
          );
        })}
      </MessageList>
      <MessageInput
        type="text"
        maxLength={60}
        onKeyPress={handleKeyPress}
        value={newMessage}
        onInput={handleNewMessageChange}
        placeholder="Write message..."
      />
    </MessageWrapper>
  );
};

export default Chat;
