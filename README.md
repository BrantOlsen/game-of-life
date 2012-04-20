      var gol = null;

      // Need to initialize the Game of Life on load.
      $(document).ready(function() {
        $(window).resize();
      });

      // Resize events may make the game ugly so adjust each time someone
      // changes the window's size.
      $(window).resize(function() {
        var canvas = document.getElementById("theCanvas");
        // Re-size the canvas to fit the whole screen. Do not use the JQuery selector here
        // since we are changing the canvas's width and height not its css width and height.
        canvas.width = $(".background").width();
        canvas.height = $(".background").height();
        var context = canvas.getContext("2d");

        if (gol == null)
        {
          gol = new GameOfLife(context, {cellSize: 10, updateInterval: 1000});
        }
        
        var rowStart = Math.floor(gol.board.rows * .3);
        var colStart = Math.floor(gol.board.columns * .4);
        gol.createGliderGun(rowStart, colStart);
        gol.createGlider(rowStart*2, colStart*2);
        gol.createGlider(rowStart*2, colStart/2);
        gol.fillCells();
      });

