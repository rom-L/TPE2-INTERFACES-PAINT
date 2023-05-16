export class Pencil {
    constructor(x, y, color, context, width) {
        this.antX = x;
        this.antY = y;
        this.posX = x;
        this.posY = y;
        this.color = color;
        this.ctx = context;
        this.width = width;
    }


    moveTo(x, y) {
        this.antX = this.posX;      //las posiciones anteriores van a ser las posiciones actuales (antes de las nuevas)
        this.antY = this.posY;

        this.posX = x;
        this.posY = y;
    }

    draw() {
        this.ctx.beginPath();

        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.width;
        this.ctx.lineCap = "round";
        this.ctx.moveTo(this.antX, this.antY);
        this.ctx.lineTo(this.posX, this.posY);
        this.ctx.stroke();

        this.ctx.closePath();
    }
}