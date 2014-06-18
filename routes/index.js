module.exports = function Route(app){
  boardPositions = []
  
  app.get('/', function(req, res){
    res.render('index', {title:'CWGoD'});
  });
  
  app.io.route('tile_clicked', function(req){
    if (boardPositions[req.data.y] === undefined ){
      boardPositions[req.data.y] = []
      boardPositions[req.data.y][req.data.x] = 1
    }
    else {
      boardPositions[req.data.y][req.data.x] = 1
    }
    console.log('Y cordinate: ' + req.data.y);
    console.log('X cordinate: ' + req.data.x)
    console.log('Board looks like: ' + boardPositions);
    app.io.broadcast('redrawBoard', { blocks: boardPositions});
  });
};
