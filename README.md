  var board = null;
  
  $(document).ready(function() {
    $(window).resize();
  });

  $(window).resize(function() {
    var canvas = document.getElementById("theCanvas");
    // Re-size the canvas to fit the whole screen. Do not use the JQuery selector here
    // since we are changing the canvas's width and height not its css width and height.
    canvas.width = $(".background").width();
    canvas.height = $(".background").height();
    var context = canvas.getContext("2d");

    if (board == null)
    {
      board = new GameOfLife(context, {color: "blue", 
                                       updateInterval: 50,
                                       drawLines: true,
                                       debug: true});
      board.toggle();
    }
    
    var rowStart = 0;
    var colStart = 0;
    board.resize();
    board.createGliderGun(rowStart, colStart);
   
    $("#theCanvas").click(function(event){
      board.toggle();
      board.fillByClick(event);
    });
  });

