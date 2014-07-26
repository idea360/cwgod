module.exports = function Route(app){

  var set_board = function(){
    var board = [];
    for(var i = 0; i < 8; i++){
      board[i] = [];
      for( var j =0; j < 8; j++){
        board[i][j] = 3;
      }
    }

    return board;
  }
   
  boardPositions = set_board();
  player1 = {}; 
  player2 = {};
  p1_name = "";
  p2_name = "";
  
  app.get('/', function(req, res){
    res.render('index', {title:'CWGoD'});
  });

  app.io.route('loop_game', function(req){
    conway_logic();
    app.io.broadcast('redrawBoard', { blocks: boardPositions});
  });
  
  app.io.route('tile_clicked', function(req){
    //only let valid users access our object
    if( player1.hasOwnProperty(req.sessionID) ){
      if (boardPositions[req.data.y] === undefined ){
        boardPositions[req.data.y] = [];
        boardPositions[req.data.y][req.data.x] = 1;
      }
      else {
        boardPositions[req.data.y][req.data.x] = 1;
      }
    }
    else if ( player2.hasOwnProperty(req.sessionID) ){
      if (boardPositions[req.data.y] === undefined ){
        boardPositions[req.data.y] = [];
        boardPositions[req.data.y][req.data.x] = 2;
      }
      else {
        boardPositions[req.data.y][req.data.x] = 2;
      } 
    }
    conway_logic();
    app.io.broadcast('redrawBoard', { blocks: boardPositions});
  });

  app.io.route('player1Joins', function(req, res){
    //console.log(player1length + ' PLayer 1 sessionID')
    if( Object.keys(player1).length === 0 ){
      player1[req.sessionID] = req.data.name;
      p1_name = req.data.name;
      //console.log('Player 1 joined ' + player1[req.sessionID] + 'Name is: ' + p1_name.length);
      app.io.broadcast('player1_connected', {name: req.data.name})
    };
  });

  app.io.route('player2Joins', function(req, res){
    if( Object.keys(player2).length === 0 ){
      player2[req.sessionID] = req.data.name;
      p2_name = req.data.name;
      //console.log('Player 2 joined ' + player2[req.sessionID])
      app.io.broadcast('player2_connected', {name: req.data.name})
   };
  });

  app.io.route('disconnect', function(req){
    if( player1.hasOwnProperty(req.sessionID) ){
      player1 = {};
      p1_name = "";
      //console.log('Player 1 left');
      app.io.broadcast('player1_disconnected');
    }
    else if ( player2.hasOwnProperty(req.sessionID) ){
      player2 = {};
      p2_name = "";
      //console.log('PLayer 2 left')
      app.io.broadcast('player2_disconnected');
    }
    else{
      //console.log('Users are leaving'); 
    }
  });
  
  app.io.route('new_connection', function(req) {
    //console.log("New user joined.")
    req.io.emit('new_user_joined', {blocks: boardPositions, p1: p1_name, p2: p2_name })
  });

  var conway_logic = function (){
    for(var row in boardPositions ){
      for( var column in boardPositions[row]){
        //var num_p1_neighbors = 0;
        //var num_p2_neighbors = 0;

        neighbors = check_neighbors(row, column)
        console.log(neighbors)
        
        value = calculate_block_value(neighbors, boardPositions[row][column]);
        
        boardPositions[row][column] = value;
      }
    } 
  }; // end conway_logic
  
  var check_neighbors = function(row, column){
     var p1 = 0, p2 = 0;
    //check top row
    var above_row = boardPositions[row - 1];
    var current_row = boardPositions[row];
    var below_row = boardPositions[row + 1];

    //check the above row
    if( above_row  != undefined ){ 
      for (var i = column - 1; i < column + 1; i++){
        if(above_row[i] != undefined){
          if(above_row[i] === 1) p1++;
          if(above_row[i] === 2) p2++;
        }
      }
    }

    //check middle row now
    for(var j = column - 1; j < column + 1; j++){
      if(j != column && current_row[j] != undefined){
        if(current_row[j] === 1) p1++;
        if(current_row[j] === 2) p2++;
      }
    }

    //check bottom row now
    if ( below_row !== undefined ){
      for( var k = column - 1; k < column + 1; k++ ){
        if(below_row[k] != undefined){
          if(below_row[k] === 1) p1++;
          if(below_row[k] === 2) p2++;
        }
      }
    }

    return {p1: p1, p2: p2};
  }
  
  var calculate_block_value = function(neighbors, current_value ){
    switch(neighbors.p1){
        case 0:
          return current_value;
          break
        case 1:
          return current_value;
          break;
        case 2:
          return twoNeighbors(neighbors, current_value);
          break;
        default:
          return war(neighbors, current_value);
      } 
    switch(neighbors.p2){
        case 0:
          return current_value;
        case 1:
          return current_value;
          break;
        case 2:
          return twoNeighbors(neighbors, current_value);
          break;
        default:
          return war(neighbors, current_value);
      } 
  }

  var twoNeighbors = function(neighbors, current_value){
    if (current_value === 1 && neighbors.p1 >= neighbors.p2) return 1;
    if (current_value === 1 && neighbors.p1 < neighbors.p2) return 2;
    if (current_value === 2 && neighbors.p2 >= neighbors.p1) return 2;
    if (current_value === 2 && neighbors.p2 < neighbors.p1) return 1;
  }

  var war = function(neighbors, current_value){
    if(current_value === 2 && neighbors.p1 > neighbors.p2) return 1;
    if(current_value === 2 && neighbors.p1 < neighbors.p2) return 2;
    if(current_value === 2 && neighbors.p1 === neighbors.p2) return 9;
    if(current_value === 1 && neighbors.p2 < neighbors.p1) return 1;
    if(current_value === 1 && neighbors.p2 > neighbors.p1) return 2;
    if(current_value === 1 && neighbors.p2 === neighbors.p1) return 9;
    if(current_value === 9 && neighbors.p1 > neighbors.p2) return 1;
    if(current_value === 9 && neighbors.p1 < neighbors.p2) return 2;
    if(current_value === 9 && neighbors.p1 === neighbors.p2) return 9;
  }

};
