import { Loading } from '@teikna/components/Loading';
import Overlay from '@teikna/components/Overlay';
import { SocketContext } from '@teikna/context';
import { RoomEvent } from '@teikna/enums';
import { useStore } from '@teikna/store';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../../components/Container';
import { WordList } from './components/WordList';

const TurnEnd = () => {
  const [isUserDrawing, setIsUserDrawing] = useState(false);
  const [openOverlay, setOpenOverlay] = useState(false);

  const { wordList, room, user } = useStore();

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

  /** do some checks here to determine if open overlay, and which component to display */

  return (
    <Overlay isOpen={openOverlay}>
      {isUserDrawing && <WordList toggleOverlay={() => setOpenOverlay(() => !openOverlay)} />}
    </Overlay>
  );
};

export default TurnEnd;
