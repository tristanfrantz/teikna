import styled from 'styled-components';

export const SettingsCard = styled.div`
  width: 300px;
  height: 300px;
  background-color: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 6px;
`;

export const SettingsTitle = styled.span`
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  border-bottom: 1px solid black;
  margin-bottom: 12px;
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
`;

export const SelectLabel = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  text-align: left;
`;

export const SelectInput = styled.select`
  width: 100%;
`;

export const TextInput = styled.input`
  width: 100%;
`;

export const StartGameButton = styled.button`
  width: 100%;
  border-radius: 4px;
  padding: 6px;
  margin-top: auto;
`;
