let board;
let score = 0;

let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
let gameOver = false;

// Function that will set the gameboard:
function setGame() {
    // Initialize a 4x4 game with all tiles set to 0
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create the game board on the HTML document
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //this will set random tile into 2
    setOne();
    setOne();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num;

        if (num <= 4096) {
            tile.classList.add("x" + num);
        } else {
            tile.classList.add("x8192");
        }
    }
}

// Event that triggers when the webpage finishes loading.
window.onload = function() {
    setGame();
    document.addEventListener("keydown", handleSlide);
}

//function that will handle the user's keyboard input when they press certain arrow keys.
function handleSlide(event) {
    if (gameOver) {
        restartGame();
        gameOver = false;
        return;
    }
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){
        //if statement that will be based on which arrow was pressed
        if(event.code == "ArrowLeft" && canMoveLeft()){
            slideLeft();
            setOne();
        }else if(event.code == "ArrowRight" && canMoveRight()){
            slideRight();
            setOne();
        }else if (event.code =="ArrowUp" && canMoveUp()){
            slideUp();
            setOne();
        }else if (event.code =="ArrowDown" && canMoveDown()) {
            slideDown();
            setOne();
        }
    }

    document.getElementById('score').innerText = score;

    setTimeout(() => {
        if (hasLost()){
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
        }
        else{
            checkWin();
        }
    }, 100)
}

function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;
    setOne();
}

// EventListener 
document.addEventListener("keydown", handleSlide);

function slideLeft(){
	for(let r= 0; r < rows; r++){
		// current array from the row
		let row = board[r]; //[0, 2, 2, 8] => [4, 8, 0, 0] / [16, 0, 0, 0]
		let originalRow = row.slice();


		//[2, 0, 2, 4] => [4, 4, 0, 0]
		row = slide(row);

		// updating the current state of the board.
		board[r] = row;

		// add for loop that will change the tiles.
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c)
			let num = board[r][c];
			if(originalRow[c] != num && num != 0){
				tile.style.animation = "slide-from-right 0.3s"

				setTimeout(() => {
					tile.style.animation = ""

				}, 300)
			}
			
			updateTile(tile, num);
		}
    }
}

function slideRight(){
	for(let r  = 0; r < rows; r++){
		
		// [4, 2, 2, 0] => [0, 0, 4, 4]
		let row = board[r];
		let originalRow = row.slice();

		//[0, 2, 2, 4]
		row = row.reverse();

		// [4, 4, 0, 0]
		row = slide(row);

		//[0, 0, 4, 4]
		row = row.reverse();

		board[r] = row;

		// Update the tiles
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" +c);
			let num = board[r][c];
			
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}
	}
}
function slideUp(){
    for (let c = 0; c < columns; c++) {
        let col = board.map(row => row[c]);
        let originalCol = col.slice();
        col = slide(col);
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalCol[r] !== num && num != 0){
                tile.style.animation = "slide-from-bottom 0.3s"
                setTimeout(() => {
                    tile.style.animation = ""
                }, 300)
            }
            updateTile(tile, num);
        }
    }
}

function slideDown(){
    for(let c = 0; c < columns; c++){
        let col = board.map(row => row[c]);
        let originalCol = col.slice();
        col = col.reverse();
        col = slide(col);
        col = col.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalCol[r] !== num && num != 0){
                tile.style.animation = "slide-from-top 0.3s"
                setTimeout(() => {
                    tile.style.animation = ""
                }, 300)
            }
            updateTile(tile, num);
        }
    }
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for(let i = 0; i < row.length - 1; i++){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns){
        row.push(0);
    }
    return row;
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setOne() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r + "-" + c);
            updateTile(tile, board[r][c]);
            found = true;
        }
    }
}

function canMoveLeft() {
    for(let r = 0; r < rows; r++){
        for(let c = 1; c < columns; c++){
            if(board[r][c] != 0){
                if(board[r][c] == board[r][c-1] || board[r][c-1] == 0){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns - 1; c++){
            if(board[r][c] != 0){
                if(board[r][c] == board[r][c+1] || board[r][c+1]==0){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp() {
    for(let c = 0; c < columns; c++){
        for(let r = 1; r < rows; r++){
            if(board[r][c] != 0){
                if(board[r-1][c] == 0 || board[r-1][c] == board[r][c]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(){
    for(let c = 0; c < columns; c++){
        for(let r = rows - 2; r >= 0; r--){
            if(board[r][c] != 0){
                if(board[r+1][c] == 0 || board[r+1][c] == board[r][c]){
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWin(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You win! You got the 2048!');
                is2048Exist = true;
            } else if(board[r][c] == 4096 && is4096Exist == false){
                alert('You are unstoppable at 4096! You are fantastic!');
                is4096Exist = true;
            } else if(board[r][c] == 8192 && is8192Exist == false){
                alert('You are a master!');
                is8192Exist = true;
            }
        }
    }
}

function hasLost(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return false;
            }

            let currentTile = board[r][c];

            if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile){
                    return false;
                }
            }
    }
    return true;
}