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
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 50%;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  height: 100%;

  padding: 16px;

  transition: transform ${transitionAnimation};

  &.${transitionName}-enter {
    transform: translateY(-100%);
  }

  &.${transitionName}-enter-active {
    transform: translateY(0);
  }

  &.${transitionName}-exit {
    transform: translateY(0);
  }

  &.${transitionName}-exit-active {
    transform: translateY(-100%);
  }
`;

const TransitionWrapper: React.FC<{ isOpen: boolean }> = ({ isOpen, children }) => (
  <CSSTransition in={isOpen} classNames={transitionName} timeout={transitionTime} unmountOnExit>
    {children}
  </CSSTransition>
);

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
}

const Overlay: React.FC<Props> = ({ children, isOpen }) => {
  return (
    <OverlayWrapper>
      <TransitionWrapper isOpen={isOpen}>
        <Content>{children}</Content>
      </TransitionWrapper>
    </OverlayWrapper>
  );
};

export default Overlay;
