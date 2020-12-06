import { Loading } from '@teikna/components/Loading';
import { SocketContext } from '@teikna/context';
import { RoomEvent } from '@teikna/enums';
import { useStore } from '@teikna/store';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const transitionName = 'overlayToggle';
const transitionTime = 2000;
const transitionAnimation = `${transitionTime}ms cubic-bezier(0.4, 0, 0.2, 1)`;

const OverlayWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  transition: opacity ${transitionAnimation};
  opacity: 50%;
  z-index: -1;

  &.${transitionName}-enter {
    opacity: 0;
  }

  &.${transitionName}-enter-active {
    opacity: 50%;
  }

  &.${transitionName}-exit {
    opacity: 50%;
  }

  &.${transitionName}-exit-active {
    opacity: 0;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  color: white;
  font-weight: 600;
  font-size: 20px;

  padding: 16px;
`;

const WordListWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

const Word = styled.button`
  padding: 14px;
`;

const TransitionWrapper: React.FC<{ isOpen: boolean }> = ({ isOpen, children }) => (
  <CSSTransition in={isOpen} classNames={transitionName} timeout={225} unmountOnExit>
    {children}
  </CSSTransition>
);

const Overlay = () => {
  const [openOverlay, setOpenOverlay] = useState(false);
  const [isUserDrawing, setIsUserDrawing] = useState(false);
  const socket = useContext(SocketContext);
  const { wordList, setWordList, room, user } = useStore();

  useEffect(() => {
    if (user && room) {
      setIsUserDrawing(room.drawingUser.id === user.id);
    }
  }, [room]);

  useEffect(() => {
    if (wordList.length) {
      setOpenOverlay(true);
    }
  }, [wordList]);

  const handleWordSelect = (word: string) => {
    if (room) {
      socket.emit(RoomEvent.SELECTWORD, room.id, word);
      setWordList([]);
      setOpenOverlay(false);
    }
  };

  if (!room || !user) {
    return <Loading />;
  }

  return (
    <TransitionWrapper isOpen={openOverlay}>
      {/* <OverlayWrapper> */}
      <Content>
        {isUserDrawing ? (
          <WordListWrapper>
            {wordList.map((word) => (
              <Word onClick={() => handleWordSelect(word)}>{word}</Word>
            ))}
          </WordListWrapper>
        ) : (
          <React.Fragment>
            {room.drawingUser.name} {`${room.isUserDrawing ? 'is drawing' : 'is choosing a word'}`}
          </React.Fragment>
        )}
      </Content>
      {/* </OverlayWrapper> */}
    </TransitionWrapper>
  );
};

export default Overlay;
