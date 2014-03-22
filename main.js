var windowSize = { x: 1152, y: 480 };
var game = new Phaser.Game(windowSize.x, windowSize.y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var bg;
var player;
var buildings;
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
  
  game.load.audio('bgaudio', ['audio/bg.ogg']);
  
  cursors = game.input.keyboard.createCursorKeys();
}

function create () {
  bg = game.add.sprite(0, statusHeight, 'bgimage');
  
  music = game.add.audio('bgaudio');
  music.play('', 0, 0.4, true);
  
  groups = {
    buildings: game.add.group(),
    floors: game.add.group(),
    rooms: game.add.group(),
    ledges: game.add.group(),
    glasses: game.add.group(),
    bullets: game.add.group()
  };
 
  game.world.setBounds(0, 0, 20000, windowSize.y);
}

var cameraSpeed = 100;
function update() {
  
  // Move camera
  if (cursors.right.isDown) {
    game.camera.x += cameraSpeed;
  } else if (cursors.left.isDown) {
    game.camera.x -= cameraSpeed;
  }

  // Parallax
  bg.x = game.camera.x * 0.85;
}
