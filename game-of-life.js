//http://en.wikipedia.org/wiki/Conway's_Game_of_Life
function GameOfLife(context, settings)
{
  // Force settings to be an object.
  settings = settings || {};
  // Save the settings for use everywhere.
  this.settings = settings;
    
  this.board = new Object();
  this.board.context = context;
  this.board.cellSize = 25;
  if (this.settings.cellSize)
  {
    this.board.cellSize = this.settings.cellSize;   
  }
  
  /*!
   * Determine the number of rows and columns of the board based on the size
   * of the canvas and cellSize.
   * 
   * Please note that this will reset boards state.
   */
  this.resize = function() 
  {
    this.board.rows = Math.floor(context.canvas.height / this.board.cellSize);
    if (this.settings.maxRows && this.settings.maxRows > this.board.rows)
    {
      this.board.rows = this.settings.maxRows;
    }
    this.board.columns = Math.floor(context.canvas.width / this.board.cellSize);
    if (this.settings.maxColumns && this.settings.maxColumns > this.board.columns)
    {
      this.board.columns = this.settings.maxColumns;
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
  }
  
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

  /**
   * Create a small glider at the given coords.
   * 
   * @param row The row to start the glider at.
   * @param column The column to start the glider at.
   * 
   * @return True if the glider was created.
   */
  this.createGlider = function(row, column)
  {
    // Check to make sure the glider will fit.
    if (row+2 > this.board.rows || 
        row < 0 ||
        column+2 > this.board.columns ||
        column < 0)
    {
      return false;
    }
    
    this.board[row+1][column] = 1;
    this.board[row+2][column+1] = 1;
    this.board[row+2][column+2] = 1;
    this.board[row+1][column+2] = 1;
    this.board[row][column+2] = 1;
    
    return true;
  }
  
  /*!
   * Create a small glider gun at the given coords.
   * 
   * @param row The row to start the gun at.
   * @param column The column to start the gun at.
   * 
   * @return True if the gun was created.
   */
  this.createGliderGun = function(row, column)
  {
    // Check to make sure the glider will fit.
    if (row+6 > this.board.rows || 
        row < 0 ||
        column+17 > this.board.columns ||
        column < 0)
    {
      return false;
    }
    
    this.board[row+2][column] = 1;
    this.board[row+2][column+1] = 1;
    this.board[row+3][column] = 1;
    this.board[row+3][column+1] = 1;
    this.board[row+2][column+10] = 1;
    this.board[row+3][column+10] = 1;
    this.board[row+4][column+10] = 1;
    this.board[row+1][column+11] = 1;
    this.board[row+5][column+11] = 1;
    this.board[row][column+12] = 1;
    this.board[row+6][column+12] = 1;
    this.board[row][column+13] = 1;
    this.board[row+6][column+13] = 1;
    this.board[row+3][column+14] = 1;
    this.board[row+1][column+15] = 1;
    this.board[row+2][column+16] = 1;
    this.board[row+3][column+16] = 1;
    this.board[row+4][column+16] = 1;
    this.board[row+3][column+17] = 1;

    return true;
  }
      
  // Do an initial resize.
  this.resize();
  
  // Create a functon here to allow us to get the correct scope in the call
  // to setInterval.
  var u = function updateGOL()
  {
    u.param1.update(); 
  }
  u.param1 = this;
  setInterval(u, 500);
}