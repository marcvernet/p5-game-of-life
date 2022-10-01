/*
  Conway's Game of Life
  Marc Vernet - 1 Oct 2022
*/

const CELL_RESOLUTION = 4;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const SEED_DENSITY = 0.2
const CELL_ALIVE_COLOR = 0;
const CANVAS_BACKGROUND_COLOR = 255;
const TARGET_FRAMERATE = 60

let cols, rows;
let grids = new Array(2);
let currentGridIndex = 0;
let generateNewSeed = false;

function setup() {

  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  cols = width / CELL_RESOLUTION;
  rows = height / CELL_RESOLUTION;
  
  grids[0] = Array.from(Array(cols), () => new Array(rows));
  grids[1] = Array.from(Array(cols), () => new Array(rows));
  createRandomCells(grids[currentGridIndex]);
  
  noLoop();
  frameRate(TARGET_FRAMERATE);
}

function draw() {
  
  let bufferGridIndex = 0;
  
  if(currentGridIndex == 0){bufferGridIndex = 1;}

  renderGrid(grids[currentGridIndex]);
  if(generateNewSeed){
    createRandomCells(grids[bufferGridIndex]);
    generateNewSeed = false;
  }
  else{
    calculateNextGrid(grids[currentGridIndex], grids[bufferGridIndex]);
  }
  currentGridIndex = bufferGridIndex;
}

function createRandomCells(grid){

  for (let x = 0; x < cols; x++){
    for (let y = 0; y < rows; y++){
      grid[x][y] = Math.random() < SEED_DENSITY;
    }
  }
}

function calculateNextGrid(currentGrid, bufferGrid){
  
  for (let x = 0; x < cols; x++){
    for (let y = 0; y < rows; y++){
      bufferGrid[x][y] = calculateCellState(currentGrid, x, y);
    }
  }
}

function renderGrid(grid){

  background (CANVAS_BACKGROUND_COLOR);
  for (let x = 0; x < cols; x++){
    for (let y = 0; y < rows; y++){
      if(grid[x][y] == true){
        fill(CELL_ALIVE_COLOR);
        stroke(CELL_ALIVE_COLOR);
        rect(x * CELL_RESOLUTION ,y * CELL_RESOLUTION, CELL_RESOLUTION, CELL_RESOLUTION);
      }  
    }
  }
}


function calculateCellState(grid, x, y){

  /*
    Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent.
    At each step in time, the following transitions occur:

    1 Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    2 Any live cell with two or three live neighbours lives on to the next generation.
    3 Any live cell with more than three live neighbours dies, as if by overpopulation.
    4 Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  */

  let aliveAdjacentCells = countAliveAdjacentCells(grid, x, y);
  let isAlive = grid[x][y];

  if(isAlive == false && aliveAdjacentCells == 3){
    return true;
  }
  else if(isAlive == true && (aliveAdjacentCells < 2 || aliveAdjacentCells > 3) ){
    return false;
  }
  else{
    return isAlive; 
  }
}

function countAliveAdjacentCells(grid, x, y){
  
  let aliveCellCount = 0;
  for(let i = - 1; i < 2; i++){
    for(let j = - 1; j < 2; j++){
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      if(!(x == col && y== row) && grid[col][row] == true){
          aliveCellCount ++;
      }
    }
  }
  return aliveCellCount;
}

function keyPressed() {
  
  if (keyCode === 32) {  // Space
    if(isLooping()){
      noLoop();
    }else{
      loop();
    }
  }
  else if (keyCode === 82) {  // R
    generateNewSeed = true;
  }
}