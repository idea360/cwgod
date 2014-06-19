 $(document).ready(function(){
  io = io.connect();
  //Create a new even to get data of an existing game
  io.emit('new_connection');

  io.on('new_user_joined', function(data){
    console.log(data.p1)
    if (data.p1.length > 0){
      $('#player1').text(data.p1 + ' is green');
    }
    if (data.p2.length > 0){
      $('#player2').text(data.p2 + ' is purple');
    }
    //update the board for the user.
    draw(data.blocks)
  });

  io.on('redrawBoard', function(data){
    draw(data.blocks);
  });

  $('#player1').click(function(){
    var p1 = prompt('Enter your name for Player 1: ');
    io.emit('player1Joins', {name: p1}); 
  });

  $('#player2').click(function(){
    var p2 = prompt('Enter your name for Player 2: ');    
    io.emit('player2Joins', {name: p2});
  });
  
  io.on('player1_connected', function(data){
    $('#player1').text(data.name + ' is green');
  });

  io.on('player2_connected', function(data){
    $('#player2').text(data.name + ' is purple');
  });

  io.on('player1_disconnected', function(){
    $('#player1').text('Join as Player 1');
  });

  io.on('player2_disconnected', function(){
    $('#player2').text('Join as Player 2');
  });
});
