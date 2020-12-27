import { SocketContext } from '@teikna/context';
import { RoomEvent } from '@teikna/enums';
import { useStore } from '@teikna/store';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';

const WordListWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const Word = styled.button`
  padding: 16px;
  width: 140px;
  text-align: center;
`;

interface Props {
  toggleOverlay: () => void;
}

export const WordList: React.FC<Props> = ({ toggleOverlay }) => {
  const socket = useContext(SocketContext);
  const { wordList, setWordList, room, user } = useStore();

  const handleWordSelect = (word: string) => {
    if (room) {
      socket.emit(RoomEvent.SELECTWORD, room.id, word);
      setWordList([]);
      toggleOverlay();
    }
  };

  return (
    <WordListWrapper>
      {wordList.map((word) => (
        <Word onClick={() => handleWordSelect(word)}>{word}</Word>
      ))}
    </WordListWrapper>
  );
};
