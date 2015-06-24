var players = [];
var socket = io.connect('http://localhost:9000');
var UiPlayers = document.getElementById("players");
var Q = Quintus({audioSupported: [ 'wav','mp3' ], development: true })
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();
 
//Q.gravityY = 0.6;
 
var objectFiles = [
  './src/player'
];
 
require(objectFiles, function () {

  function setUp (stage) {
    socket.on('count', function (data) {
      UiPlayers.innerHTML = 'Players: ' + data['playerCount'];
    });
 
    socket.on('connected', function (data) {
      selfId = data['playerId'];
      player = new Q.Player({ playerId: selfId, x: 100, y: 100, socket: socket });
      stage.insert(player);
      stage.add('viewport').follow(player);
    });

    socket.on('updated', function (data) {
      var actor = players.filter(function (obj) {
        return obj.playerId == data['playerId'];
      })[0];
      if (actor) {
        actor.player.p.x = data['x'];
        actor.player.p.y = data['y'];
        actor.player.p.sheet = data['sheet'];
        actor.player.p.update = true;
      } else {
        var temp = new Q.Actor({ playerId: data['playerId'], x: data['x'], y: data['y'], sheet: data['sheet'] });
        players.push({ player: temp, playerId: data['playerId'] });
        stage.insert(temp);
      }
    });
  }

  Q.scene('arena', function (stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));
    setUp(stage);
  });
 
  var files = [
    '/images/tiles.png',
    '/maps/arena.json',
    '/images/mage.png',
    '/images/mage.json'
  ];
 
  Q.load(files.join(','), function () {
    Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
    Q.compileSheets('/images/mage.png', '/images/mage.json');
    Q.animations('player', {
      run_right: { frames: [0,1], rate: 1/8 }, 
      run_left: { frames: [2,3], rate: 1/8 },
      stand_right: { frames: [0], rate: 1/8 },
      stand_left: { frames: [2], rate: 1/8 }
    });
    Q.stageScene('arena', 0);
  });
});