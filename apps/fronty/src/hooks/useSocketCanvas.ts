import { Coordinates, DrawData } from '@teikna/interfaces';
import { useRef, useState, useEffect, useContext } from 'react';
import { throttle } from 'lodash';
import { SocketContext, UserContext } from '../context';
import { MessageEvent } from '@teikna/enums';

const useSocketCanvas = () => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderCtx, setRenderCtx] = useState<CanvasRenderingContext2D | null>(null);

  const drawLine = (data: DrawData) => {
    const { start, end, color, lineWidth } = data;
    if (renderCtx) {
      renderCtx.beginPath();
      renderCtx.moveTo(start.x, start.y);
      renderCtx.lineTo(end.x, end.y);
      renderCtx.strokeStyle = color;
      renderCtx.lineWidth = lineWidth;
      renderCtx.stroke();
      renderCtx.closePath();
    }
  };

  useEffect(() => {
    let mouseDown = false;
    let start: Coordinates = { x: 0, y: 0 };
    let end: Coordinates = { x: 0, y: 0 };
    let canvasOffsetLeft = 0;
    let canvasOffsetTop = 0;

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleMouseDown = (evt: MouseEvent) => {
      mouseDown = true;

      start = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };

      end = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };
    };

    const handleMouseMove = (evt: MouseEvent) => {
      if (mouseDown) {
        start = {
          x: end.x,
          y: end.y,
        };

        end = {
          x: evt.clientX - canvasOffsetLeft,
          y: evt.clientY - canvasOffsetTop,
        };

        const data = { start, end, color: '#000', lineWidth: 2, room: user.roomId };

        drawLine(data);
        socket.emit(MessageEvent.DRAW, data);
      }
    };

    if (canvasRef?.current) {
      canvasRef.current.addEventListener('mousedown', handleMouseDown, false);
      canvasRef.current.addEventListener('mouseup', handleMouseUp, false);
      canvasRef.current.addEventListener('mouseout', handleMouseUp, false);
      canvasRef.current.addEventListener('mousemove', throttle(handleMouseMove, 10), false);

      // TODO: Mobile touch support
      // canvasRef.current.addEventListener('touchstart', handleMouseDown, false);
      // canvasRef.current.addEventListener('touchend', handleMouseUp, false);
      // canvasRef.current.addEventListener('touchcancel', handleMouseUp, false);
      // canvasRef.current.addEventListener('touchmove', throttle(handleMouseMove, 10), false);

      canvasOffsetLeft = canvasRef.current.offsetLeft;
      canvasOffsetTop = canvasRef.current.offsetTop;
      setRenderCtx(canvasRef.current.getContext('2d'));
    }

    // Event listeners
    socket.on(MessageEvent.DRAW, (data: DrawData) => {
      drawLine(data);
    });

    // cleanup
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mouseup', handleMouseUp);
        canvasRef.current.removeEventListener('mouseout', handleMouseUp);
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [renderCtx]);

  return { canvasRef };
};

export default useSocketCanvas;
