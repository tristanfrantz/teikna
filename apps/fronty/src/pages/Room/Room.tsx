import { RoomEvent } from '@teikna/enums';
import { Room } from '@teikna/interfaces';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../../components/Container';
import { RoomContext, SocketContext, UserContext } from '../../context';
import Messages from './Chat';
import DrawingBoard from './DrawingBoard';
import { CanvasWrapper, ContentWrapper, Header, RoomWrapper, Round, Timer } from './Room.styles';
import Users from './Users';
import { differenceInSeconds } from 'date-fns';


const ChatRoom = () => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const room = useContext(RoomContext);

  const [isDrawing, setIsDrawing] = useState(room.drawingUser.id === user.id);
  const [threeWords, setThreeWords] = useState<string[]>([]);
  const [roundTimer, setRoundtimer] = useState(room.drawTime);



  useEffect(() => {
    console.log(room.drawingUser.name, user.name);
    setIsDrawing(room.drawingUser.id === user.id);
    setThreeWords([]);
  }, [room.drawingUser.id]);

  // /** when users enter room, start game after 3 secs or sumthin */
  useEffect(() => {
    if (isDrawing) {
      setTimeout(() => {
        socket.emit(RoomEvent.STARTGAME);
        setRoundtimer(room.drawTime);
      }, 3000);
    }
  }, [isDrawing]);

  /** if user is drawing, listen for three words to select from */
  useEffect(() => {
    if (isDrawing) {
      socket.on(RoomEvent.WORDLIST, (words: string[]) => {
        setThreeWords(words);
      });
    }
  }, [isDrawing, room]);

  /** handle timer */
  useEffect(() => {
    if (roundTimer <= 0 && user.id === room.drawingUser.id && room.isUserDrawing) {
      socket.emit(RoomEvent.TURNEND);
    }

    const interval = setInterval(() => {
      if (room.turn) {
        const diff = differenceInSeconds(new Date(), new Date(room.turn?.startDateTime));
        const newRounderTimer = Math.min(Math.max(roundTimer - diff, 0), room.drawTime);
        setRoundtimer(newRounderTimer);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [room.turn?.startDateTime]);


  const handleWordSelect = (word: string) => {
    socket.emit(RoomEvent.SELECTWORD, room.id, word);
  };

  return (
    <Container>
      <RoomWrapper>
        <h1>{room.drawingUser.name} is drawing</h1>
        <Header>
          <Timer
            src={
              'https://images.vexels.com/media/users/3/192919/isolated/preview/28fece9fbbd599d507ecd28c8febacf8-stopwatch-timer-stroke-icon-stopwatch-by-vexels.png'
            }
          />
          <Round>{`Round ${room.currentRound} of ${room.roundLimit}`}</Round>
          <Round style={{ marginLeft: '20px' }}>{roundTimer}</Round>
          {!room.isUserDrawing && (
            <div>
              {threeWords.map((word) => (
                <button style={{ margin: '10px' }} onClick={() => handleWordSelect(word)}>
                  {word}
                </button>
              ))}
            </div>
          )}
        </Header>
        <ContentWrapper>
          <Users />
          <CanvasWrapper>
            <DrawingBoard />
          </CanvasWrapper>
          <Messages />
        </ContentWrapper>
      </RoomWrapper>
    </Container>
  );
};

export default ChatRoom;
