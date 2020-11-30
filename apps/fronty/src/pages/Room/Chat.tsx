import React, { KeyboardEvent, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import useSocketChat from '../../hooks/useSocketChat';
import { Message } from '@teikna/interfaces';
import { UserMessage, MessageInput, MessageItem, MessageList, MessageSender, MessageWrapper } from './Room.styles';
import { MessageType } from '@teikna/enums';

const Chat = () => {
  const { messages, sendMessage, hasGuessedWord } = useSocketChat();
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
        {messages.map((message: Message, index: number) => {
          const { user, content, timestamp } = message;
          return (
            <MessageItem key={index}>
              <div>
                {message.type === MessageType.USERMESSAGE && <MessageSender>{`${user?.name}: `}</MessageSender>}
                <UserMessage type={message.type}>{content}</UserMessage>
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
