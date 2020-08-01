document.addEventListener('DOMContentLoaded', () =>{ //this is like defer, load html first and then all the javascript

  const grid = document.querySelector('.grid'); //selects the div with class grid
  let width = 10; //the number of squares (10 by 10)
  let bombAmount = 20; //number of bombs
  let squares = []; //all the squares array
  let isGameOver = false;
  let flags = 0;

  //function to create the board
  function createBoard() {
    //get shuffeled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb'); //create an array of size bombAmount and fill it with 'bomb'
    const emptyArray = Array(width*width - bombAmount).fill('valid'); //create an array with valid moves
    const gameArray = emptyArray.concat(bombsArray); //create game array with bombs and valid moves
    const shuffeledArray = gameArray.sort(() => Math.random() - 0.5); //generate the shuffeled game array
    //create 100 squares in the div
    for(let i=0; i < width*width; i++){
      const square = document.createElement('div'); //create a div
      square.setAttribute('id', i); //give each div you create an unique id from 0 to 99
      square.classList.add(shuffeledArray[i]); //set the created square to be either a bomb or a valid move
      grid.appendChild(square); //append the created square to the div grid
      squares.push(square); //add created square to the squares array

      //add event listner for click to each square
      square.addEventListener('click', (e) => {
        click(square);
      });

      //add event listner for control + click for a square to flag/deflag it
      square.oncontextmenu = function (e){
        e.preventDefault(); //prevents the default from happening
        addFlag(square);
      }
    }

    //display nearby number of bombs
    for(let i = 0; i < squares.length; i++){
      let total = 0;
      //define left edge and right edge as we don't want to check over the edges
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width - 1);

      //check if the square we are looping over is valid
      if (squares[i].classList.contains('valid')){
        //if the left square is not a left edge and the square contains a bomb add 1 to total
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')){
          total++;
        }
        //if the square is not a right edge and the square to the right above of it contains a bomb add 1 to total
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')){
          total++;
        }
        //if the square above is a bomb add one to the total
        if (i > 10 && squares[i - width].classList.contains('bomb')){
          total++;
        }
        //if the square above left is not a left edge and the square is a bomb add 1 to total
        if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')){
          total++;
        }
        //if the square to the right is not a right edge and contains a bomb then add 1 to total
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')){
          total++;
        }
        //if the square below left is not a left edge and contains a bomb then add 1 total
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')){
          total++;
        }
        //if the square below right is not a right edge and contains a bomb then add 1 to total
        if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')){
          total++;
        }
        //if the square below is a bomb then add 1 to total
        if (i < 89 && squares[i + width].classList.contains('bomb')){
          total++;
        }
        //set the data attribute of the square to be the total number of bombs around it
        squares[i].setAttribute('data', total);
      }
    }
  }

  //click on square function
  function click(square) {
    //get square id
    let currentId = square.id;
    //if the game is over exit
    if (isGameOver){
      return;
    }
    //if the clicked square is checked already or has a flag return
    if (square.classList.contains('checked') || square.classList.contains('flag')){
      return;
    }
    //if the square is a bomb end game
    if (square.classList.contains('bomb')){
      gameOver(square);
    } else {
      let total = square.getAttribute('data');
      //if the total of the square is different than 0 check the square and display total inside the square
      if (total != 0){
        square.classList.add('checked');
        square.innerHTML = total;
        return;
      }
      //call recursive function to check empty total squares around
      checkSquare(square, currentId);
      square.classList.add('checked');
    }
  }
  
  //function to check neghboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    // after 10 miliseconds check the surrounding squares
    setTimeout(() => {

      if (currentId > 0 && !isLeftEdge){
        //get the id of the square directly to the left of it
        const newId = squares[parseInt(currentId) - 1].id;
        //get the new square by id
        const newSquare = document.getElementById(newId);
        //use recursion via the click function
        click(newSquare);
      }
      
      if (currentId > 9 && !isRightEdge){
        //get the id of the square above right
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 10){
        //get the id of the square above
        const newId = squares[parseInt(currentId)- width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 11 && !isLeftEdge){
        //get the id of the square above
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 98 && !isRightEdge){
        //get the id of the square in the right
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      
      if (currentId < 90 && !isLeftEdge){
        //get the id of the square in the above left
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 88 && !isRightEdge){
        //get the id of the square in the above right
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 89){
        //get the id of the square above
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //add flag function with right click
  function addFlag(square){
    //if it is game over return
    if (isGameOver){
      return;
    }
    //if the square isn't checked and flags are less than bomb amount
    if(!square.classList.contains('checked') && (flags < bombAmount)){
      //check if the square doesn't contain a flag
      if (!square.classList.contains('flag')){
        //add flag and increment flag count
        square.classList.add('flag');
        square.innerHTML = '🚩'; //this flag is just an emoji you can get by searching on google for "flag emoji"
        flags++;
        checkForWin();
      } else {
        //remove flag and decrement flag count
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
      }
    }
  }

  //function to check for win
  function checkForWin() {
    let matches = 0;
    //loop over the squares
    for(let i = 0; i < squares.length; i++){
      //check if the square that has a flag on it has a bomb as well and increase matches if it does
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
        matches++;
      }
      //check if the matches match the bombAmount
      if (matches === bombAmount){
        isGameOver = true;
        alert('winner');
      }
    }
  }

  //game over function
  function gameOver(square){
    isGameOver = true;
    //show all bomb locations
    squares.forEach(square => {
      if (square.classList.contains('bomb')){
        square.innerHTML = '💣'; //this bomb is just an emoji you can get by searching on google for "bomb emoji"
      }
    })
  }

  createBoard(); //create the board

});