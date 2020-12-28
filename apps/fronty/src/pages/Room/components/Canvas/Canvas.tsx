import React, { useContext, useEffect, useRef, useState, MouseEvent } from 'react';
import { SocketContext } from '@teikna/context';
import { CanvasEvent } from '@teikna/enums';
import { DrawData } from '@teikna/interfaces';
import { throttle } from 'lodash';
import { DrawModel } from '@teikna/models';
import styled from 'styled-components';
import { extractIsUserDrawing, useStore } from '@teikna/store';

const StyledCanvas = styled.canvas`
  height: 100%;
  width: 100%;
  border: 1px solid black;
`
const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext(SocketContext);
  const [drawing, setDrawing] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const room = useStore(state => state.room);
  const isUserDrawing = useStore(state => extractIsUserDrawing(state));

  useEffect(() => {
    resizeCanvas()
    canvasRef.current?.addEventListener('resize', resizeCanvas, false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      room?.turn?.draws?.forEach((data: DrawData) => {
        drawLine(ctx, data);
      })

      socket.on(CanvasEvent.DRAW, (data: DrawData) => {
        drawLine(ctx, data)
      });

      socket.on(CanvasEvent.CLEAR, () => {
        clearCanvas();
      })
    }
  }, [])

  const resizeCanvas = () => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      // some magic code for devices with high pixel density
      // const ctx = canvas.getContext('2d');
      // const { devicePixelRatio:ratio=1 } = window
      // ctx?.scale(ratio, ratio)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

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
    if (!drawing || !isUserDrawing) {
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
