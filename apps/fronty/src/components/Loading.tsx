import React from 'react';
import Container from '@teikna/components/Container';
import CircleLoader from 'react-spinners/ClipLoader';

export const Loading = () => {
  return (
    <Container>
      <CircleLoader />
    </Container>
  );
};
