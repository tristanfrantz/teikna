import React, { KeyboardEvent, ChangeEvent } from 'react';
import { Message } from '@teikna/interfaces';
import { UserMessage, MessageInput, MessageItem, MessageList, MessageSender, MessageWrapper } from './Chat.styles';
import { MessageType } from '@teikna/enums';
import useSocketChat from '@teikna/hooks/useSocketChat';

const Chat = () => {
  const { messages, sendMessage } = useSocketChat();
  const [newMessage, setNewMessage] = React.useState('');

  const handleNewMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && newMessage) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <MessageWrapper>
      <MessageList id="messageList">
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
