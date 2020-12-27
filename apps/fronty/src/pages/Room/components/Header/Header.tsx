import { RoomContext, SocketContext } from '@teikna/context';
import { RoomEvent } from '@teikna/enums';
import { useStore } from '@teikna/store';
import { differenceInSeconds } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import {
  RoundWrapper,
  HeaderContainer,
  Round,
  Timer,
  ClockWordWrapper,
  WordWrapper,
  Letter,
  LetterWrapper,
  Underscore,
} from './Header.styles';

const Header = () => {
  const word = ['b', 'y', 's', 's', 'a'];

  const { room } = useStore();
  const socket = useContext(SocketContext);
  const [turnTimer, setTurnTimer] = useState(room?.drawTime ?? 50);

  useEffect(() => {
    if (room) {
      const interval = setInterval(() => {
        if (room.isUserDrawing) {
          const diff = differenceInSeconds(new Date(), new Date(room.turn.startDateTime));
          const newRounderTimer = Math.min(Math.max(turnTimer - diff, 0), room.drawTime);
          setTurnTimer(newRounderTimer);
        }
      }, 900);

      return () => clearInterval(interval);
    }
  }, [room?.turn?.startDateTime]);

  return (
    <HeaderContainer>
      <RoundWrapper>
        <Round>{`Round ${room?.currentRound} of ${room?.roundLimit}`}</Round>
      </RoundWrapper>
      <ClockWordWrapper>
        <Round>{turnTimer}</Round>
        <WordWrapper></WordWrapper>
      </ClockWordWrapper>
    </HeaderContainer>
  );
};

export default Header;
