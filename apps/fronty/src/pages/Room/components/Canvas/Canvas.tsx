import React, { useContext, useEffect, useRef, useState, MouseEvent } from 'react';
import { SocketContext } from '@teikna/context';
import { CanvasEvent } from '@teikna/enums';
import { DrawData } from '@teikna/interfaces';
import { throttle } from 'lodash';
import { DrawModel } from '@teikna/models';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  border: 1px solid black;
`

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext(SocketContext);
  const [drawing, setDrawing] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    socket.on(CanvasEvent.DRAW, (data: DrawData) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        drawLine(ctx, data);
      }
    })
  }, [])

  const drawLine = (ctx: CanvasRenderingContext2D, data: DrawData) => {
    const { x0, y0, x1, y1, color, lineWidth } = data;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    setOffsetX(e.nativeEvent.offsetX);
    setOffsetY(e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) {
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const { offsetX: eventOffsetX, offsetY: eventOffsetY } = e.nativeEvent;
      const data = new DrawModel(offsetX, offsetY, eventOffsetX, eventOffsetY);
      drawLine(ctx, data);
      setOffsetX(eventOffsetX);
      setOffsetY(eventOffsetY);
      socket.emit(CanvasEvent.DRAW, data);
    }
  };

  return (
    <StyledCanvas
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onMouseDown={handleMouseDown}
      onMouseMove={throttle(handleMouseMove, 10)}
      id="canvas"
      ref={canvasRef}
    />
  );
};

export default Canvas;
