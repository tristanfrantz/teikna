import { DrawData } from '@teikna/interfaces';

export class DrawModel implements DrawData {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  lineWidth: number;
  roomId?: string;
  constructor(x0: number, y0: number, x1: number, y1: number, color = "#000", lineWidth = 2) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    this.color = color;
    this.lineWidth = lineWidth;
  }
}
