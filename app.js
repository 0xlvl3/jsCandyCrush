document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const width = 8;
  const squares = [];
  let score = 0;

  //colors that we will loop through randomly
  const candyColors = [
    "url(./images/red-candy.png)",
    "url(./images/yellow-candy.png)",
    "url(./images/orange-candy.png)",
    "url(./images/blue-candy.png)",
    "url(./images/green-candy.png)",
    "url(./images/purple-candy.png)",
  ];

  //create a board
  function createBoard() {
    //create a squares with our loop
    for (let i = 0; i < width * width; i++) {
      //where we will put our square elements
      const square = document.createElement("div");
      //giving our squares and id each set loop index
      square.setAttribute("id", i);
      //makes the squares draggable
      square.setAttribute("draggable", true);
      //how we randomise the colors
      let randomColor = Math.floor(Math.random() * candyColors.length);
      //setting the background of our squares to the specific color
      square.style.backgroundImage = candyColors[randomColor];
      //how we append our square into our grid
      grid.appendChild(square);
      //push all our squares within our squares div we created at the start
      squares.push(square);
    }
  }

  createBoard();

  //Drag the candies
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = +this.id;
    console.log(colorBeingDragged);
    console.log(this.id, "dragstart");
  }
  function dragOver(e) {
    e.preventDefault();
    console.log(this.id, "dragover");
  }
  function dragLeave() {
    console.log(this.id, "dragleave");
  }
  function dragDrop() {
    console.log(this.id, "drop");
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = +this.id;
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }
  function dragEnter(e) {
    e.preventDefault();
    console.log(this.id, "dragenter");
  }
  function dragEnd() {
    console.log(this.id, "dragend");
    //what is a valid move?
    let validMoves = [
      //for which square we choose to drag this logic will allow us to switch between only the squares around our chosen square
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ];

    //if our square being replaced is included within our valid moves array then it is true and is a valid move
    let validMove = validMoves.includes(squareIdBeingReplaced);

    //logic for the above code
    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
  }

  //drop candies once some have been cleared
  function moveIntoSquareBelow() {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundImage === "") {
          let randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundImage = candyColors[randomColor];
        }
      }
    }
  }

  //checking for matches

  //check for row of four
  function checkRowForFour() {
    for (i = 0; i < 61; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      //will stop checking for 4 at
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForFour();

  //check for column of four
  function checkColumnForFour() {
    for (i = 0; i < 47; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        columnOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4;
        scoreDisplay.innerHTML = score;
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForFour();

  //check for row of three
  function checkRowForThree() {
    for (i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      //will stop checking for 3 at
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForThree();

  //check for column of three
  function checkColumnForThree() {
    for (i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";
      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3;
        scoreDisplay.innerHTML = score;
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForThree();

  setInterval(function () {
    moveIntoSquareBelow();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
  }, 100);
});
