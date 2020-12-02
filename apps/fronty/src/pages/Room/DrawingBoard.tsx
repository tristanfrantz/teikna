import React, { useEffect } from 'react';
import useSocketCanvas from '../../hooks/useSocketCanvas';

const DrawingBoard = () => {
  const { canvasRef } = useSocketCanvas();

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      style={{
        border: '2px solid #000',
      }}
    />
  );
};

export default DrawingBoard;
