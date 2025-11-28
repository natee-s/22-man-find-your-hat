"use strict";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

// Board tiles
const PLAYER = "🤠";
const EMPTY = "░";
const HOLE = "O";
const HAT = "^";

// Hardcoded board
// let board = [
// 	[PLAYER, EMPTY, HOLE],
// 	[EMPTY, HOLE, EMPTY],
// 	[EMPTY, HAT, EMPTY],
// ];
let board = [
	[[PLAYER], [EMPTY], [HOLE]],
	[[EMPTY], [HOLE], [EMPTY]],
	[[EMPTY], [HAT], [EMPTY]],
];

const rowLength = board.length
const colLength = board[0].length

const moves = [];

// Game state
let playerRow = 0;
let playerCol = 0;
let playing = true;

// Define movement functions
function moveRight(){
	if(playerCol < colLength){
		playerCol++;
		moves.push(bound[row][col]);
	} else{
	console.log("invalid move")
	}
}

function moveLeft(){
	if(playerCol < colLength){
		playerCol--;
		moves.push(bound[row][col]);
	} else{
	console.log("invalid move")
	}
}

function moveUp(){
	if(playerRow < colLength){
		playerRow++;
		moves.push(bound[row][col]);
	} else{
	console.log("invalid move")
	}
}

function moveDown(){
	if(playerRow < colLength){
		playerRow--;
		moves.push(bound[row][col]);
	} else{
	console.log("invalid move")
	}
}

moveUp();
moveDown();
moveLeft();
moveRight();

// Print board
function printBoard(board) {
	console.clear(); // call console.clear() before print each move
	console.log(board);
}

// Game play loop
printBoard(board);
const input = prompt("Which way? (w/a/s/d): ");
console.log(input);















