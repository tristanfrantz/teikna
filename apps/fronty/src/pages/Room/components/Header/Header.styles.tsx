import Card from '@teikna/components/Card';
import styled from 'styled-components';

export const HeaderContainer = styled(Card)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100px;
  border: 1px solid red;
  position: relative;
`;

export const RoundWrapper = styled.div`
  width: 200px;
  display: flex;
  position: absolute;
  left: 20px;
`;

export const ClockWordWrapper = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const WordWrapper = styled.div`
  display: flex;
`;

export const LetterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  text-decoration: underline;
`;

export const Letter = styled.span`
  font-size: 28px;
  margin: 0 4px;
`;

export const Underscore = styled.span`
  position: absolute;
  bottom: -4p;
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
