import { MessageType } from '@teikna/enums';
import styled, { css } from 'styled-components';

export const RoomWrapper = styled.div`
  width: 1400px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-height: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing}px;
  background-color: white;
  margin-bottom: 6px;
`;

export const Timer = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 6px;
`;

export const Round = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

export const CanvasWrapper = styled.div`
  width: 900px;
  height: 100%;
  margin: 20px;
`;

export const MessageWrapper = styled.div`
  width: 300px;
  height: 100%;
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

export const TurnEndContainer = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
`;
