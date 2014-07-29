function board_click(ev)
{
    canvas.addEventListener('click', board_click, false);

    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;

    if (x <= canvas.height){
       var xBlock = Math.floor(x / BLOCK_SIZE);
       var yBlock = Math.floor(y / BLOCK_SIZE);
    }

    io.emit('tile_clicked', { x: xBlock, y: yBlock});
}

function draw (users_board)
{
    //console.dir(usersBlocks)
    // Main entry point got the HTML5 chess board example
    canvas = document.getElementById('board');
    NUMBER_OF_ROWS = 16;
    NUMBER_OF_COLS = 16;
    //console.dir(global_users_board);
    ctx = canvas.getContext('2d');
    // Calculdate the precise block size
    BLOCK_SIZE = (canvas.height / NUMBER_OF_ROWS);
         
    // First visit to the webpage 
    if(canvas.getContext)
    {
      // Draw the background
      drawBoard(users_board, NUMBER_OF_ROWS, ctx, BLOCK_SIZE, NUMBER_OF_COLS);
 
      canvas.addEventListener('click', board_click, false);
      }
      else
      {
        alert("Canvas not supported!");
      }
 }

var drawBoard = function (users_board, NUMBER_OF_ROWS, ctx, BLOCK_SIZE, NUMBER_OF_COLS)
{  
    for(var iRowCounter = 0; iRowCounter < NUMBER_OF_ROWS; iRowCounter++)
    {
        drawRow(iRowCounter, users_board, NUMBER_OF_ROWS, ctx, BLOCK_SIZE, NUMBER_OF_COLS);
    }  
     
    // Draw outline
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, NUMBER_OF_ROWS * BLOCK_SIZE, NUMBER_OF_COLS * BLOCK_SIZE);
}

var drawRow = function (iRowCounter, users_board, NUMBER_OF_ROWS, ctx, BLOCK_SIZE)
{
    // Draw NUMBER_OF_ROWS block left to right
    for(iBlockCounter = 0; iBlockCounter < NUMBER_OF_ROWS; iBlockCounter++)
    {
        drawBlock(iRowCounter, iBlockCounter, users_board, ctx, BLOCK_SIZE);
    }
}

var drawBlock = function (iRowCounter, iBlockCounter, users_board, ctx, BLOCK_SIZE)
{  
    // Set the background
    ctx.fillStyle = getBlockColour(iRowCounter, iBlockCounter, users_board);
     
    // Draw rectangle for the background
    ctx.fillRect(iRowCounter * BLOCK_SIZE, iBlockCounter * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
 
    ctx.stroke();  
}

var getBlockColour = function (iRowCounter, iBlockCounter, users_board)
{
    var cStartColour;
    var BLOCK_COLOUR_1 = 'gray', BLOCK_COLOUR_2 = 'darkgray', BLOCK_COLOUR_TAKEN_P1 = 'green', BLOCK_COLOUR_TAKEN_P2 = 'purple';
    //console.log(iRowCounter + " "+iBlockCounter)

    if ( users_board != undefined ) {
      if( users_board[iBlockCounter] != null && users_board[iBlockCounter][iRowCounter] != null && users_board[iBlockCounter][iRowCounter] === 1 ) {
          cStartColour = BLOCK_COLOUR_TAKEN_P1;
      }
      else if( users_board[iBlockCounter] != null && users_board[iBlockCounter][iRowCounter] != null && users_board[iBlockCounter][iRowCounter] === 2 ) {
          cStartColour = BLOCK_COLOUR_TAKEN_P2;
      }
      else{
        if(iRowCounter % 2){
          cStartColour = (iBlockCounter % 2?BLOCK_COLOUR_1:BLOCK_COLOUR_2);
        } 
        else {
          cStartColour = (iBlockCounter % 2?BLOCK_COLOUR_2:BLOCK_COLOUR_1);
        }
      }
    }
    else{
      if(iRowCounter % 2){
        cStartColour = (iBlockCounter % 2?BLOCK_COLOUR_1:BLOCK_COLOUR_2);
      } 
      else {
        cStartColour = (iBlockCounter % 2?BLOCK_COLOUR_2:BLOCK_COLOUR_1);
      }
    }

    return cStartColour;
}
