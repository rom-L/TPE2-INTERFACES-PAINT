"use strict";
/** @type {HTMLCanvasElement} */

import { Pencil } from "./classes/pencil.js";
import { CanvasImage } from "./classes/canvasImage.js";



const CANVAS = document.querySelector("#my-canvas");
const CANVAS_WIDTH = CANVAS.width;
const CANVAS_HEIGHT = CANVAS.height;

const CTX = CANVAS.getContext("2d");

const PENCIL_BTN = document.querySelector(".pencil-btn");
const ERASER_BTN = document.querySelector(".eraser-btn");
const COLOR_BUTTONS = document.querySelectorAll(".color-btn");
const COLOR_PALETTE_INPUT = document.querySelector(".color-palette-input");
const LINE_WIDTH_INPUT = document.querySelector(".lineWidth-input");
const APPLY_FILTER_BTN = document.querySelector(".apply-btn");
const LOAD_IMG_INPUT = document.querySelector("#img-input");
const CLEAR_BTN =  document.querySelector("#clear-canvas-btn");
const DOWNLOAD_BTN = document.querySelector("#download-img-btn");



let mouseUp = true;
let mouseDown = false;

//valores predeterminados para el lapiz
let myPencil = null;
let pencilIsEnabled = false;
let eraserIsEnabled = false;
let selectedColor = "black";
let lineWidth = 5;

let myCanvasImage = null;





/*******************EVENTOS******************/

CLEAR_BTN.addEventListener("click", function(e) {
    CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    LOAD_IMG_INPUT.value = "";      //se vacia el value del input cargar imagen por si en caso de que se haya cargado una imagen no la siga considerando cargada
});

LOAD_IMG_INPUT.addEventListener("change", function(e) {
    CTX.globalCompositeOperation = "source-over";       //se pasa a "source-over" por si el ultimo click fue en la goma y se quiere cargar una imagen (no la cargaria)
    
    const FILE = this.files[0];
    
    drawImage(FILE);
    LOAD_IMG_INPUT.value = "";      //se vacia el value del input cargar imagen por si en caso de que se haya cargado una imagen no la siga considerando cargada
});

DOWNLOAD_BTN.addEventListener("click", function(e) {
    downloadImage();
});

PENCIL_BTN.addEventListener("click", function(e) {
    CTX.globalCompositeOperation = "source-over";           //todo lo que se dibuje en el canvas queda guardado (vuelve a la normalidad luego de haber usado el destination-out de la goma) 
    pencilIsEnabled = true;
    eraserIsEnabled = false;
    giveStyleIfSelected();
});

ERASER_BTN.addEventListener("click", function(e) {   
    CTX.globalCompositeOperation = "destination-out";       //sirve para lo que haya borrado no quede dibujado en el canvas, ya que no lo borra realmente, sino que utiliza un color blanco
    pencilIsEnabled = false;
    eraserIsEnabled = true;
    giveStyleIfSelected();    
});

COLOR_PALETTE_INPUT.addEventListener("input", function(e) {    //cuando se elige un color en la paleta el lapiz toma ese color
    if (pencilIsEnabled == true) {
        selectedColor = COLOR_PALETTE_INPUT.value;
    }
});

LINE_WIDTH_INPUT.addEventListener("change", function(e) {
    lineWidth = LINE_WIDTH_INPUT.value;
});

APPLY_FILTER_BTN.addEventListener("click", function(e) {
    applyFilter();
});

for (const button of COLOR_BUTTONS) {
    button.addEventListener("click", function(e) {
        if (pencilIsEnabled == true) {
            //a cada boton le doy el evento para cambiar el color; accede a su "data-color" con e.target.dataset.color
            selectedColor = e.target.dataset.color;
        }
    });
}


//cuando se aprieta el mouse se crea un objeto lapiz dependiendo de si se apreto un lapiz o una goma
CANVAS.addEventListener("mousedown", function(e) {
    mouseUp = false;
    mouseDown = true;

    if (pencilIsEnabled == true && eraserIsEnabled == false) {
        myPencil = new Pencil(e.offsetX, e.offsetY, selectedColor, CTX, lineWidth);       //CREA UN LAPIZ
    } else if (pencilIsEnabled == false && eraserIsEnabled == true) {
        myPencil = new Pencil(e.offsetX, e.offsetY, "white", CTX, lineWidth);             //CREA UNA GOMA(color blanco ya que debe borrar)
    }
});

CANVAS.addEventListener("mousemove", function(e) {
    if (mouseDown == true && myPencil != null) {
        myPencil.moveTo(e.offsetX, e.offsetY);
        myPencil.draw();
    }
});

CANVAS.addEventListener("mouseup", function(e) {
    mouseUp = true;
    mouseDown = false;

    myPencil = null;      //pencil pasa a null ya que se levanto el mouse 
});







//*****************FUNCIONES****************/

function drawImage(file) {
    //chequeo si no esta vacio y si es una imagen
    if (file != null && file.type.startsWith('image/')) {
        const IMG = new Image();
        
        IMG.onload = function(e) {
            CTX.drawImage(IMG, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        
        //creo una URL de la imagen cargada para darsela a la source
        IMG.src = URL.createObjectURL(file);
    }
}

function downloadImage() {
    const LINK = document.createElement("a");   //se inserta un elemento anchor(link) en el DOM para poder descargar el archivo

    LINK.href = CANVAS.toDataURL();             //convierte al href del link en el dataURL de lo que esta dibujado en el canvas
    LINK.download = "canvas.jpg";               //este va a ser el nombre del archivo cuando se descargue
    LINK.click();                               //se simula un click al link de descarga automaticamente
    LINK.delete();                              //se borra el link del DOM
}

function applyFilter() {
    myCanvasImage = new CanvasImage(0, 0, CTX, CANVAS_WIDTH, CANVAS_HEIGHT);        //CREA OBJETO IMAGEN
    const FILTER_SELECT_VALUE = document.querySelector("#select-filters").value;

    //se aplica un filtro determinado por el select que ingreso el usuario
    switch (FILTER_SELECT_VALUE) {
        case "negativo": {
            myCanvasImage.applyNegative();
        } break;
        case "brillo": {
            myCanvasImage.applyBrightness();
        } break;
        case "binarizacion": {
            myCanvasImage.applyBinarization();
        } break;
        case "sepia": {
            myCanvasImage.applySepia();
        } break;
        case "saturacion": {
            myCanvasImage.applySaturation();
        } break;
        case "blur": {
            myCanvasImage.applyBlur();
        } break;
    }
        

    myCanvasImage = null;       //pasa a null porque ya se manipulo
}

//esta funcion agrega estilo al lapiz y goma
function giveStyleIfSelected() {
    if (pencilIsEnabled == true && eraserIsEnabled == false) {
        PENCIL_BTN.classList.add("selected");
        ERASER_BTN.classList.remove("selected");
    } else if (pencilIsEnabled == false && eraserIsEnabled == true) {
        PENCIL_BTN.classList.remove("selected");
        ERASER_BTN.classList.add("selected");
    }
}