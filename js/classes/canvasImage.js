export class CanvasImage {
    constructor(x, y, context, width, height) {
        this.posX = x;
        this.posY = y;
        this.ctx = context;
        this.width = width;
        this.height = height;
        this.imageData = this.ctx.getImageData(this.posX, this.posY, this.width, this.height);
    }


    applyFilter() {
        this.ctx.putImageData(this.imageData, this.posX, this.posY);
    }

    /****FILTROS****/

    applyNegative() {
        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const R = this.imageData.data[i];
            const G = this.imageData.data[i + 1];
            const B = this.imageData.data[i + 2];

            this.imageData.data[i] = 255 - R;
            this.imageData.data[i + 1] = 255 - G;
            this.imageData.data[i + 2] = 255 - B;
        }
        
        this.applyFilter();
    }

    applyBrightness() {
        const BRIGHTNESS = 2;

        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const R = this.imageData.data[i];
            const G = this.imageData.data[i + 1];
            const B = this.imageData.data[i + 2];

            this.imageData.data[i] = Math.min(R * BRIGHTNESS, 255);
            this.imageData.data[i + 1] = Math.min(G * BRIGHTNESS, 255);
            this.imageData.data[i + 2] = Math.min(B * BRIGHTNESS, 255);
        }    

        this.applyFilter();
    }

    applyBinarization() {
        const UMBRAL = 128;

        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const R = this.imageData.data[i];
            const G = this.imageData.data[i + 1];
            const B = this.imageData.data[i + 2];

            //formula para conseguir el valor de los grises
            const GRAY = (R + G + B) / 3;

            //formula para conseguir binarizado dependiendo del umbral proporcionado
            let binarizado = 0;
            if (GRAY < UMBRAL) {
                binarizado = 0; 
            } else {
                binarizado = 255; 
            }

            this.imageData.data[i] = binarizado;
            this.imageData.data[i + 1] = binarizado;
            this.imageData.data[i + 2] = binarizado;
        }    

        this.applyFilter();
    }

    applySepia() {
        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const R = this.imageData.data[i];
            const G = this.imageData.data[i + 1];
            const B = this.imageData.data[i + 2];

            const GRAY = (R + G + B) / 3;    

            this.imageData.data[i] = Math.min(GRAY + 100, 255);
            this.imageData.data[i + 1] = Math.min(GRAY + 50, 255);
            this.imageData.data[i + 2] = GRAY;
        }    
        
        this.applyFilter();
    }

    applySaturation() {
        const SATURATION = 300;
        const INTENSITY = (SATURATION + 100) / 100;
        
        const RW = 0.3086;
        const RG = 0.6084;
        const RB = 0.082;

        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const R = this.imageData.data[i];
            const G = this.imageData.data[i + 1];
            const B = this.imageData.data[i + 2];

            const GRAY = RW * R + RG * G + RB * B;
            this.imageData.data[i] = GRAY + INTENSITY * (R - GRAY);
            this.imageData.data[i + 1] = GRAY + INTENSITY * (G - GRAY);
            this.imageData.data[i + 2] = GRAY + INTENSITY * (B - GRAY);
        }

        this.applyFilter();
    }

    applyBlur() {
        const DATA = this.imageData.data;
        const WIDTH = this.imageData.width;
        const HEIGHT = this.imageData.height;

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const index = (y * WIDTH + x) * 4;

                let r = 0;
                let g = 0;
                let b = 0;

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * WIDTH + (x + kx)) * 4;

                        if (pixelIndex >= 0 && pixelIndex < DATA.length) {
                            r += DATA[pixelIndex];
                            g += DATA[pixelIndex + 1];
                            b += DATA[pixelIndex + 2];
                        }
                    }
                }

                DATA[index] = r / 9;
                DATA[index + 1] = g / 9;
                DATA[index + 2] = b / 9;
            }
        }

        this.applyFilter();
    }
  
}