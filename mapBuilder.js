import {Grid} from "./Grid.js";

/** 
 * TO DO
 * - delimiter une zone ou l'image sera construite (fixer la taille de l'image) OK
 * - decouper l'imqge en plusieurs tuiles unitaire OK
 * - le but sera d'assembler plusieures image ensemble pour faire la map EN COURS
 * 	- utiliser layerX et layerY pour connaitre la position du du curseur lors du clic, cela pour la cas particulier ou on clique sur une tile deja posée (0,0)
 * 	- 
 * - 	chaque nouvelle image devra prendre en compte les contraintes de position des tuiles adjacente de l'image precedente
 * - exporter l'image en png
 */

/**
 * Manage canvas and create context
 */
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let numberOfDisplayTile = 0;

/** 
 * LAYOUT
 */
// dimensions should be the same as the jelly car canvas
canvas.width = 960;
canvas.height = 540;
// HTML elements
let gridDisplayButton = document.getElementById("gridVisibilityButton");
// let tilesDisplayer = document.getElementsByClassName("tileDisplayer");
let groundImage = document.getElementById("ground_20x20");
let flatImage = document.getElementById("flat_20x20");
let upImage = document.getElementById("up_20x20");
let downImage = document.getElementById("down_20x20");
//
let floatingImage = document.getElementById("floating-image");
let imageSource = document.getElementById("selected-image");
//
let captureButton = document.getElementById("captureButton");
//
let canvasBox = document.getElementById("canvasBox");
//
let divArray = [];
//
let gridConstraint = [];

/**
 * GRID LAYOUT
 */
let grid = new Grid(20, canvas, context);
grid.draw();

function toggleVisibility() {
	if (grid.isVisible) {
		grid.hide();
	} else {
		grid.draw();
	}
}

function selectTile() {
	imageSource.src = this.src;
}

function move(e) {
	floatingImage.style.left = (e.pageX + 10) + "px";
	floatingImage.style.top = (e.pageY + 10) + "px";
}

function clearSelectedImage() {
	imageSource.src = "";
}
function calculateTilePosition(eventX, eventY) {
	// tile dimension is 20x20
	var x, y; // left, top
	x = Math.floor(eventX / 20) * 20;
	y = Math.floor(eventY / 20) * 20;
	return [x ,y];
}
function createTileDiv(x, y, imageSource, e) {
	var div = document.createElement("div");
	// iterate div ID so it unique for all tile
	// div.id = "tileDiv" + numberOfDisplayTile.toString();
	// div.id = "test";
	div.id = "tile" + x + "-" + y;
	if (imageSource !== ""
		&& divArray.indexOf(div.id) === -1
		&& e.target.parentNode.id === "canvasBox") {
		divArray.push(div.id);
		// var text = document.createTextNode("Yooo!")
		// div.appendChild(text);
		var img = document.createElement("img");
		img.src = imageSource;
		div.style.left = x + "px";
		div.style.top = y + "px";
		div.appendChild(img);
		// document.body.appendChild(div);
		// append to canvas box so it can be positionned relativly to it
		// canvasBox.offsetLeft pour avoir la position de canvasBos
		canvasBox.appendChild(div);
	}
}
function removeTileDiv(e) {
	var divIdToRemove = e.target.parentNode.id;
	if (divIdToRemove !== "canvasBox") {
		var divToRemove = document.getElementById(divIdToRemove);
		divToRemove.remove();
		// remove from div array
		var itemIndexToRemove = divArray.indexOf(divIdToRemove);
		divArray.splice(itemIndexToRemove, 1);
	}
}
function initializeConstraintGrid() {
	// initialize grid constraint
	var nbOfColumn = canvas.width / 20;
	var nbOfLine = canvas.height / 20;
	// build an array representing the line
	var currentLine = new Array(nbOfColumn);
	for (let i = 0; i < nbOfColumn; i++) {currentLine[i] = 0};
	// push the line array in the global gridConstraint array, will result into a 2D array
	for (let j = 0; j < nbOfLine; j++) gridConstraint.push(currentLine);
	// console.table(gridConstraint);
}

function doCapture(e) {
	html2canvas(canvasBox).then((canvas) => {
		console.log("in html2canvas!");
		const base64image = canvas.toDataURL("image/png");
		//https://dev.to/sbodi10/download-images-using-javascript-51a9
		// https://dev.to/seanwelshbrown/how-to-save-an-html5-canvas-as-an-image-with-todataurl-1hjj
		const link = document.createElement('a');
		link.href = base64image;
		link.download = 'map';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});
}
// ======= EVENTS HANDLER =======
gridDisplayButton.onclick = toggleVisibility;
groundImage.onclick = selectTile;
flatImage.onclick = selectTile;
upImage.onclick = selectTile;
downImage.onclick = selectTile;
captureButton.onclick = doCapture;
// Add event handlers
document.addEventListener("mousemove", (e) => {
	move(e);
});
//
document.addEventListener("keydown", (e) => {
	if (e.key === 'Escape') {
        clearSelectedImage();
    }
})
canvasBox.addEventListener("mousedown", (e) => {
	if (e.button === 0) {
		// left button
		var tilePosition = calculateTilePosition(e.offsetX, e.offsetY);
		createTileDiv(tilePosition[0], tilePosition[1], imageSource.src, e);
	} else if (e.button === 2) {
		// the following three lines don't work to prevent default browser behavior on mouse click
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		removeTileDiv(e);
	}
})
initializeConstraintGrid();