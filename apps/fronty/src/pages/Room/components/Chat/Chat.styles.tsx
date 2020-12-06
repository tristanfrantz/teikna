import { MessageType } from '@teikna/enums';
import styled, { css } from 'styled-components';

export const MessageWrapper = styled.div`
  width: 250px;
  height: 100%;
  /* max-height: 700px; */
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 6px;
  background-color: white;
`;

export const MessageList = styled.div`
  overflow-y: auto;
  height: 100%;
`;

export const MessageItem = styled.div`
  width: 100%;
  display: flex;
  padding: 4px;
  :nth-child(odd) {
    background-color: ${(p) => p.theme.palette.offWhite};
  }
`;

export const MessageSender = styled.span`
  font-weight: 600;
`;

export const UserMessage = styled.span<{ type?: MessageType }>`
  word-wrap: break-word;

  ${(p) =>
    p.type === MessageType.SERVERMESSAGE &&
    css`
      color: green;
      font-weight: 600;
    `}

  ${(p) =>
    p.type === MessageType.PRIVATEMESSAGE &&
    css`
      color: brown;
      font-weight: 600;
    `}
`;

export const MessageInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 6px 12px;
  font-size: 16px;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
