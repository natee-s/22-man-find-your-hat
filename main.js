"use strict";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

// Board tiles
const PLAYER = "🤠";
const EMPTY = "🟩";
const HOLE = "⚫️";
const HAT = "🧢";

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



// Print board
function printBoard(board) {
	console.clear(); // call console.clear() before print each move
	console.log(board);
	for(let row of board){
		console.log(row.join(""));
	}
}

// Create board แบบสุ่ม
function generateBoard(height, width) {
    // 1. ก่อนเริ่ม Loop ประกาศตัวแปรและสุ่มตำแหน่ง Hat
    let newBoard = [];
    let hatRow;
    let hatCol;

    // สุ่ม Hat ซ้ำจนกว่าจะไม่ซ้ำกับตำแหน่ง Player ที่ตำแหน่ง(0, 0)
    do {												// ให้ทำการสุ่มการ 1 ครั้ง
        hatRow = Math.floor(Math.random() * height);	// สุ่มเลข จำนวนเต็ม โดยขยาย scale ถึงขนาดของ height
        hatCol = Math.floor(Math.random() * width);		// สุ่มเลข จำนวนเต็ม โดยขยาย scale ถึงขนาดของ width
    } while (hatRow === 0 && hatCol === 0);				 // หยุดเมื่อเข้าเงื่อนไขนี้

    // 2. เริ่ม Loop สร้างกระดาน
    for (let i = 0; i < height; i++) { // Outer Loop (ลูปที่วนตาม height) Loop เพื่อสร้างแถว
        let row = [];

        for (let x = 0; x < width; x++) {  // Inner For Loop เพื่อสร้าง col
            
			// การจัดวางตำแหน่งไม่ให้ทับซ้อน
            // ไม่ทับซ้อน Hat
            if (i === hatRow && x === hatCol) {
                row.push(HAT);
			// ไม่ทับซ้อน Player (0, 0)
            } else if (i === 0 && x === 0) {
                row.push(PLAYER); 
            } else if (
                // วาง HOLE (ถ้ามีโอกาส 30% และไม่ทับซ้อน)
                Math.random() < 0.3 && 
                (i !== 0 || x !== 0) && 
                (i !== hatRow || x !== hatCol)
            ) {
                row.push(HOLE);
            } else {
                // วางพื้นว่าง
                row.push(EMPTY);
            }
        }
        
        newBoard.push(row); // นำแถวที่สร้างเสร็จแล้วใส่ในกระดานหลัก
    }

    return newBoard;
}


// Input Functions --> รับคำสั่งการเดินจากผู้เล่น
function getUserInput(){
	while(true){			// Loop ไปเรื่อยๆ จนกว่าจะได้ input ที่ถูกต้อง
		const input = prompt("Which way? (w/a/s/d): ").toLowerCase();
		if(input === "w"||input === "a"||input === "s"||input === "d"){
			return input;  // ถ้าถูกต้อง ให้คืนค่าและออกจาก loop
		} else{
			console.log("คุณใส่คำสั่งผิด❌นะใส่ใหม่ได้ไหม ใส่ได้แค่(w, a, s, d) เท่านั้น")
		}
	}
}



// Movement Functions (การคำนวณตำแหน่งใหม่)
function calculateNewPosition(input, currentRow, currentCol) {
    let newRow = currentRow;
    let newCol = currentCol;

    switch (input) {
        case 'w': // Up (แถวลด)
            newRow -= 1;
            break;
        case 's': // Down (แถวเพิ่ม)
            newRow += 1;
            break;
        case 'a': // Left (คอลัมน์ลด)
            newCol -= 1;
            break;
        case 'd': // Right (คอลัมน์เพิ่ม)
            newCol += 1;
            break;
    }
    // คืนค่าตำแหน่งใหม่ในรูปแบบ Object เพื่อให้ง่ายต่อการนำไปใช้
    return { newRow, newCol }; 
}


// check Game Rule Functions

// ไม่ออกนอกขอบเขตของกระดาน
// ไม่ตกลงในหลุม (HOLE)
// พบหมวก (HAT) --> (WIN)

function checkGameStatus(newRow, newCol, board) {
    const height = board.length; // ความสูงของกระดาน (จำนวนแถว)
    const width = board[0].length; // ความกว้างของกระดาน (จำนวนคอลัมน์)

    // 1. ตรวจสอบว่าไม่ออกนอกขอบเขตของกระดาน
    if (
        newRow < 0 ||             // เหนือขอบบน
        newRow >= height ||       // ใต้ขอบล่าง
        newCol < 0 ||             // ซ้ายขอบซ้าย
        newCol >= width           // ขวาขอบขวา
    ) {
        return "Lose - ออกนอกขอบเขต";
    }

    // 2. ตรวจสอบตำแหน่งใหม่บนกระดาน
    const nextTile = board[newRow][newCol];

    if (nextTile === HAT) {
        return 'Win';			 	// เงื่อนไขชนะ
    } else if (nextTile === HOLE) {
        return 'Lose'; 	// เงื่อนไขแพ้
    } else {
        return 'Continue'; 			// ไปต่อได้
    }
}

//Game Play Loop
let gameBoard = generateBoard(rowLength, colLength);
function playGame() {
  let playing = true; // ตัวแปรควบคุมลูป 

  while (playing) {
    // 1. แสดงผลกระดาน
    printBoard(gameBoard);

    // 2. รับinputจากผู้เล่น
    let direction = getUserInput();

    // 3. คำนวณตำแหน่งใหม่
    let nextPos = calculateNewPosition(direction, playerRow, playerCol);
    let newRow = nextPos.newRow;
	let newCol = nextPos.newCol;

    // 4. ตรวจสอบกฎของเกม (ชนะ/แพ้/ไปต่อ)
    let status = checkGameStatus(newRow, newCol, gameBoard);

    if (status === "Win") {
      console.log("ยินดีด้วย! คุณเจอหมวกแล้ว 🧢");
      playing = false; // จบเกม
    } else if (status === "Lose") {
      console.log("เสียใจด้วย คุณแพ้แล้ว 😵");
      playing = false; // จบเกม
    } else {
      // 5. อัปเดตตำแหน่งผู้เล่นบนกระดาน
      gameBoard[playerRow][playerCol] = EMPTY; // ลบรอยเท้าเดิม (ใส่พื้นที่ว่าง)
      playerRow = newRow;
      playerCol = newCol;
      gameBoard[playerRow][playerCol] = PLAYER; // ย้ายตัวละครไปช่องใหม่
    }
  }
}

playGame();



