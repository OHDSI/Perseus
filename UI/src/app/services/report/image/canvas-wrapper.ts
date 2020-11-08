const defaultFont = '12px serif';
const defaultColor = 'black';

const bezierCoefficient = 0.6;

export class CanvasWrapper {
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d');

  get width() {
    return this.canvas.width;
  }

  set width(width: number) {
    this.canvas.width = width;
  }

  get height() {
    return this.canvas.height;
  }

  set height(height: number) {
    this.canvas.height = height;
  }

  fillText(text: string, x: number, y: number, styles?: { font: string, color: string }) {
    const {font = defaultFont, color = defaultColor} = styles;
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  fillRectangle(x: number, y: number, width: number, height: number, styles?: {
    fillColor: string,
    borderColor?: string,
    text?: string
    font?: string
    fontColor?: string
  }) {
    const {fillColor = defaultColor, borderColor = defaultColor, text, font, fontColor} = styles;

    this.ctx.strokeStyle = borderColor;
    this.ctx.strokeRect(x, y, width, height);

    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x, y, width, height);

    if (text) {
      this.drawTextInCenterOfRectangle(x, y, width, height, text, {font, color: fontColor});
    }
  }

  drawArrow(x1, y1, x2, y2, color) {
    const bezierValue = bezierCoefficient * (x2 - x1);

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.bezierCurveTo(x1 + bezierValue, y1, x2 - bezierValue, y2, x2, y2);
    this.ctx.stroke();
  }

  image(type: string): string {
    return this.canvas.toDataURL(type);
  }

  destroy() {
    this.canvas.remove();
  }

  private drawTextInCenterOfRectangle(x: number, y: number, width: number, height: number, text: string, styles?: {
    font?: string,
    color?: string
  }) {
    const {font = defaultFont, color = defaultColor} = styles;

    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x + width / 2, y + height / 2);
  }
}
