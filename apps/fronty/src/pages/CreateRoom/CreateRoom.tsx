import React, { ChangeEvent, useState } from 'react';
import Container from '../../components/Container';
import {
  SelectInput,
  SelectLabel,
  SelectWrapper,
  SettingsCard,
  SettingsTitle,
  StartGameButton,
  TextInput,
} from './CreateRoom.styles';

const CreateRoom = () => {
  const [drawTime, setDrawTime] = useState(50);
  const [roundCount, setRoundCount] = useState(3);
  const [roomName, setRoomName] = useState('');

  const handleRoundLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDrawTime(Number(event.target.value));
  };

  const handleDrawTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDrawTime(Number(event.target.value));
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = () => {
    /** emit start game event here  */
  };

  return (
    <Container>
      <SettingsCard>
        <SettingsTitle>Lobby</SettingsTitle>
        <SelectWrapper>
          <SelectLabel>Rounds</SelectLabel>
          <SelectInput name="roundLimit" onChange={handleRoundLimitChange}>
            <option value={2}>2</option>
            <option value={3} selected>
              3
            </option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </SelectInput>
        </SelectWrapper>
        <SelectWrapper>
          <SelectLabel>Draw time</SelectLabel>
          <SelectInput name="drawTime" onChange={handleDrawTimeChange}>
            <option value={30}>30 seconds</option>
            <option value={40}>40 seconds</option>
            <option value={50} selected>
              50 seconds
            </option>
            <option value={60}>60 seconds</option>
          </SelectInput>
        </SelectWrapper>
        <SelectWrapper>
          <SelectLabel>Lobby name</SelectLabel>
          <TextInput type="text" placeholder="Type your room name.." onInput={handleRoomNameChange} />
        </SelectWrapper>
        <StartGameButton>Start game</StartGameButton>
      </SettingsCard>
    </Container>
  );
};

export default CreateRoom;
