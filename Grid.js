/**
 * Grid object that will be display over the canvas 48*27
 * Carreful the grid size ;ust be a common deno;inator between canvas width and height
 */
export class Grid {
	constructor (gridSize, canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");;
		this.gridSize = gridSize;
		this.horizontalCellNumber = Math.floor(canvas.width / gridSize);
		this.verticalCellNumber = Math.floor(canvas.height / gridSize);
		this.isVisible
	}

	draw () {
		let c = this.context;
		let w = this.canvas.width;
		let h = this.canvas.height;
		let curentYCoordinate, curentXCoordinate;
		// draw the outline frame of the canvas
		c.rect(0, 0, this.canvas.width, this.canvas.height);
		c.stroke();
		// draw internal lines
		c.beginPath();
		// draw horizontal lines
		for (let yIndex = 1; yIndex < this.verticalCellNumber ; yIndex++) {
			curentYCoordinate = yIndex * this.gridSize;
			c.moveTo(0, curentYCoordinate);
			c.lineTo(w, curentYCoordinate);
		}
		// draw vertical lines
		for (let xIndex = 0; xIndex < this.horizontalCellNumber ; xIndex++) {
			curentXCoordinate = xIndex * this.gridSize;
			c.moveTo(curentXCoordinate, 0);
			c.lineTo(curentXCoordinate, h);
		}
		// render the lines
		c.stroke();
		this.isVisible = true;
	}
	
	hide () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.isVisible = false;
	}
}
