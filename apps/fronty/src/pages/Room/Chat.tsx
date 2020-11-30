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

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      console.log('only enter sir');
      handleSendMessage();
    }
  };

  return (
    <MessageWrapper>
      <MessageList>
        {messages.map((message: Message) => {
          const { user, content } = message;
          return (
            <MessageItem>
              <div>
                <MessageSender>{`${user?.name ?? 'some ugly dude'}: `}</MessageSender>
                <MessageContent>{content}</MessageContent>
              </div>
            </MessageItem>
          );
        })}
      </MessageList>
      <form onSubmit={handleSubmit(handleSendMessage)}>
        <MessageInput
          type="text"
          maxLength={60}
          onKeyPress={handleKeyPress}
          value={newMessage}
          onInput={handleNewMessageChange}
          placeholder="Write message..."
        />
      </form>
    </MessageWrapper>
  );
};

export default Chat;
