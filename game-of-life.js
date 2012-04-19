//http://en.wikipedia.org/wiki/Conway's_Game_of_Life
function GameOfLife(context)
{
  this.board = new Object();
  this.board.context = context;
  this.board.cellSize = 25;
  this.board.rows = Math.floor(context.canvas.height / this.board.cellSize);
  this.board.columns = Math.floor(context.canvas.width / this.board.cellSize);

  /*!
   * Fill the given cell for the row and column with a black box.
   *
   * @param row The row of the cell.
   * @column column The column of the cell.
   */
  this.fillCell = function(row, column) {
    this.board.context.fillStyle = "black";
    var x = column * this.board.cellSize;
    var y = row * this.board.cellSize;
    this.board.context.fillRect(x, y, this.board.cellSize, this.board.cellSize);
  }

  /*!
   * Fill all cells that contain the value 1.
   */
  this.fillCells = function() {
    for (var i = 0; i < this.board.rows; ++i)
    {
      for (var j = 0; j < this.board.columns; ++j)
      {
        if (this.board[i][j] == 1)
        {
          this.fillCell(i, j);
        }
      }
    }
  }

  /*!
   * Determine how many adjacent neighbors are alive for this cell.
   *
   * @param row The cell's row number.
   * @param column The cell's column number.
   *
   * @return The number of adjacent alive rows.
   */
  this.getNeighbourCount = function(row, column)
  {
    var count = 0;
    var columnToRight = column - 1;
    var columnToLeft = column + 1;
    var rowAbove = row - 1;
    var rowBelow = row + 1;

    if (columnToRight < this.board.columns)
    {
      count = count + this.board[row][columnToRight];
    }
    if (columnToLeft >= 0)
    {
      count = count + this.board[row][columnToLeft];
    }
    // Count the rows above us that are alive.
    if (rowAbove >= 0)
    {
      count = count + this.board[rowAbove][column];
      if (columnToRight < this.board.columns)
      {
        count = count + this.board[rowAbove][columnToRight];
      }
      if (columnToLeft >= 0)
      {
        count = count + this.board[rowAbove][columnToLeft];
      }
    }
    // Count the cells below us that are alive.
    if (rowBelow < this.board.rows)
    {
      count = count + this.board[rowBelow][column];
      if (columnToRight < this.board.columns)
      {
        count = count + this.board[rowBelow][columnToRight];
      }
      if (columnToLeft >= 0)
      {
        count = count + this.board[rowBelow][columnToLeft];
      }
    }

    return count;
  }

  /*!
   * Determine which cells live and die.
   */
  this.determineNextState = function()
  {
    for (var i = 0; i < this.board.rows; ++i)
    {
      for (var j = 0; j < this.board.columns; ++j)
      {
        var numberOfNeighbours = this.getNeighbourCount(i, j);
        // Rule 4 of Life.
        if (this.board[i][j] == 0 && numberOfNeighbours  == 3)
        {
          this.board.nextState[i][j] = 1;
        }
        else if (this.board[i][j] == 1)
        {
          // Rule 1 and Rule 3 of Life.
          if (numberOfNeighbours < 2 || numberOfNeighbours > 3)
          {
            this.board.nextState[i][j] = 0;
          }
          // Rule 2 of Life.
          else
          {
            this.board.nextState[i][j] = 1;
          }
        }
      }
    }
  }

  /*!
   * Copy all values in nextState to the this.board.
   */
  this.moveToNextState = function()
  {
    for (var i = 0; i < this.board.rows; ++i)
    {
      for (var j = 0; j < this.board.columns; ++j)
      {
        this.board[i][j] = this.board.nextState[i][j];
      }
    }
  }

  /*!
   * Clear the canvas of everything.
   */
  this.clear = function()
  {
    this.board.context.clearRect(0, 0, this.board.context.canvas.width, this.board.context.canvas.height);
  }

  /*!
   * Draw the this.board. Then update it for the next call to update.
   */
  this.update = function()
  {
    this.clear();
    this.fillCells();
    this.determineNextState();
    this.moveToNextState();
  }

  // Init the this.board and its next state with blank values.
  this.board.nextState = new Array(this.board.rows);
  for (var i = 0; i < this.board.rows; ++i)
  {
    this.board[i] = new Array(this.board.columns);
    this.board.nextState[i] = new Array(this.board.columns);
    for (var j = 0; j < this.board.columns; ++j)
    {
      this.board[i][j] = 0;
      this.board.nextState[i][j] = 0;
    }
  }

  // Semi-Glider Gun.
  try
  {
    var rowStart = 6;
    var colStart = 6;
    this.board[rowStart+6][colStart+2] = 1;
    this.board[rowStart+6][colStart+3] = 1;
    this.board[rowStart+7][colStart+2] = 1;
    this.board[rowStart+7][colStart+3] = 1;
    this.board[rowStart+6][colStart+12] = 1;
    this.board[rowStart+7][colStart+12] = 1;
    this.board[rowStart+8][colStart+12] = 1;
    this.board[rowStart+5][colStart+13] = 1;
    this.board[rowStart+9][colStart+13] = 1;
    this.board[rowStart+4][colStart+14] = 1;
    this.board[rowStart+10][colStart+14] = 1;
    this.board[rowStart+4][colStart+15] = 1;
    this.board[rowStart+10][colStart+15] = 1;
    this.board[rowStart+7][colStart+16] = 1;
    this.board[rowStart+5][colStart+17] = 1;
    this.board[rowStart+6][colStart+18] = 1;
    this.board[rowStart+7][colStart+18] = 1;
    this.board[rowStart+8][colStart+18] = 1;
    this.board[rowStart+7][colStart+19] = 1;

    // Init a glider.
    this.board[rowStart*3+3][colStart*5+2] = 1;
    this.board[rowStart*3+4][colStart*5+3] = 1;
    this.board[rowStart*3+4][colStart*5+4] = 1;
    this.board[rowStart*3+3][colStart*5+4] = 1;
    this.board[rowStart*3+2][colStart*5+4] = 1;
  }
  catch (err)
  {
  // If an error is caught then the this.board is not big enough for the
  // shape I am making. So let thins go on with whatever was initialized.
  }

  // Create a functon here to allow us to get the correct scope in the call
  // to setInterval.
  var u = function updateGOL()
  {
    u.param1.update(); 
  }
  u.param1 = this;
  setInterval(u, 500);
}

function updateGOL(gameOfLife)
{
  gameOfLife.update();
}