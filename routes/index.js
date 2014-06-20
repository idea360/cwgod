module.exports = function Route(app){

  var set_board = function(){
    var board = [];
    for(var i = 0; i < 32; i++){
      board[i] = [];
      for( var j =0; j < 32; j++){
        board[i][j] = 9;
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
        var num_p1_neighbors = 0;
        var num_p2_neighbors = 0;

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
    var top_row_count = check_top_row(row, column);
      
    //Check same row
    var same_row_count = check_same_row(row, column); 
      
    //Check the bottom rows
    var bottom_row_count = check_bottom_row(row, column)

    p1 = top_row_count.p1 + same_row_count.p1 + bottom_row_count.p1;
    p2 = top_row_count.p2 + same_row_count.p2 + bottom_row_count.p2;

    return {p1: p1, p2: p2};
  }
  
  var check_top_row = function(row, column){
    var c1 = 0, c2 = 0;
    if( boardPositions[row + 1]  != undefined ){
      if ( boardPositions[row + 1][column - 1] === 1 ) c1++;
      if ( boardPositions[row + 1][column - 1] === 2 ) c2++;
      if ( boardPositions[row + 1][column] === 1 ) c1++;
      if ( boardPositions[row + 1][column] === 2 ) c2++;
      if ( boardPositions[row + 1][column + 1] === 1 ) c1++;
      if ( boardPositions[row + 1][column + 1] === 2 ) c2++;
    }

    return {p1: c1, p2: c2};
  }

  var check_same_row = function(row, column){
    var d1 = 0, d2 = 0;
    
      if ( boardPositions[row][column - 1] === 1 ) d1++;
      if ( boardPositions[row][column - 1] === 2 ) d2++;
      if ( boardPositions[row][column + 1] === 1 ) d1++;
      if ( boardPositions[row][column + 1] === 2 ) d2++;

    return {p1: d1, p2: d2};
  }

  var check_bottom_row = function(row, column){
    var e1 = 0, e2 = 0;

      if ( boardPositions[row - 1] != undefined ){
        if ( boardPositions[row - 1][column - 1] === 1 ) e1++;
        if ( boardPositions[row - 1][column - 1] === 2 ) e2++;
        if ( boardPositions[row - 1][column] === 1 ) e1++;
        if ( boardPositions[row - 1][column] === 2 ) e2++;
        if ( boardPositions[row - 1][column + 1] === 1 ) e1++;
        if ( boardPositions[row - 1][column + 1] === 2 ) e2++;
      }

    return {p1: e1, p2: e2};
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
          return current_value;
          break;
        case 3:
          return three_neighbors(neighbors, current_value);
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
          return current_value;
          break;
        case 3:
          return three_neighbors(neighbors, current_value);
          break;
        default:
          return war(neighbors, current_value);
      } 

  }

  var three_neighbors = function(neighbors, current_value){
    if (current_value === 1) return 1;
    if (current_value === 2) return 2;
    if (neighbors.p1 > neighbors.p2) return 1;
    if (neighbors.p2 > neighbors.p1) return 2;
  }

  var war = function(neighbors, current_value){
    if(current_value === 2 && neighbors.p1 > neighbors.p2) return 1;
    if(current_value === 1 && neighbors.p2 > neighbors.p1) return 2;
    if(current_value === 9 && neighbors.p1 > neighbors.p2) return 1;
    if(current_value === 9 && neighbors.p2 > neighbors.p1) return 2;
     
  }

};
