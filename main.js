var windowSize = { x: 1152, y: 480 };
var game = new Phaser.Game(windowSize.x, windowSize.y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var mouse;
var bg;
var player;
var units = [];
var cursors;

// Layout: statusbar, game window, build bars
var statusHeight = 50;
var gameWindowHeight = 280;

// Groups
// Create them ourselves because we need to control the Z order
var groups;

var music;

function preload () {
  game.load.image('bgimage', 'images/bg.jpg');
  
  game.load.audio('bgaudio', 'audio/bg.mp3');
  
  game.load.image('frame', 'images/frame.png');
  game.load.image('selection', 'images/selection.png');
  game.load.image('tank', 'images/tank.png');
  game.load.image('tank_enemy', 'images/tank_enemy.png');
  
  game.load.audio('explode', 'audio/explode.mp3');
  game.load.audio('tank_fire', 'audio/tank_fire.mp3');
  
  cursors = game.input.keyboard.createCursorKeys();
}

function create () {
  bg = game.add.sprite(0, statusHeight, 'bgimage');
  
  music = game.add.audio('bgaudio');
  music.play('', 0, 0.3, true);
  
  groups = {
    buildings: game.add.group(),
    units: game.add.group()
  };
 
  game.world.setBounds(0, 0, 20000, windowSize.y);

  // Add a bunch of tanks
  for (var i = 300; i < 1000; i += 300) {
    units.push(new Unit(game, groups.units, 'tank', 'explode', 3.0, 20.0, 'tank_fire', 1.0, 400, 100, {x:i, y:statusHeight + gameWindowHeight}, 'player'));
  }
  // Add some enemy tanks
  for (var i = 1000; i < 2000; i += 300) {
    units.push(new Unit(game, groups.units, 'tank_enemy', 'explode', 2.5, 20.0, 'tank_fire', 1.0, 400, 120, {x:i, y:statusHeight + gameWindowHeight}, 'cpu'));
  }
  
  mouse = new Mouse(game, statusHeight, gameWindowHeight);
}

var cameraSpeed = 40;
function update() {
  
  // Select unit on click
  mouse.update(groups.units);
  
  for (var i = 0; i < units.length; i++) {
    units[i].update(units);
    // Check for dead units
    if (units[i].sprite.health <= 0) {
      // play death effects
      units[i].kill(groups.units);
      units.splice(i, 1);
      i--;
    }
  }
  
  // Move camera
  if (cursors.right.isDown) {
    game.camera.x += cameraSpeed;
  } else if (cursors.left.isDown) {
    game.camera.x -= cameraSpeed;
  }

  // Parallax
  bg.x = game.camera.x * 0.85;
}
