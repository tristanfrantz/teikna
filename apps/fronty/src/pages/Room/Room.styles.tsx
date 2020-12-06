import styled from 'styled-components';

export const RoomWrapper = styled.div`
  width: 1400px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: 700px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CanvasWrapper = styled.div`
  width: 900px;
  height: 100%;
  position: relative;
`;
