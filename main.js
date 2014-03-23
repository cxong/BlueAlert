var windowSize = { x: 1152, y: 480 };
var game = new Phaser.Game(windowSize.x, windowSize.y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var mouse;
var bg;
var units = [];
var buildings = [];
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
  game.load.image('health', 'images/health.png');
  game.load.image('health_back', 'images/health_back.png');
  game.load.image('tank', 'images/tank.png');
  game.load.image('tank_enemy', 'images/tank_enemy.png');
  game.load.image('marine', 'images/marine.png');
  game.load.image('marine_enemy', 'images/marine_enemy.png');
  game.load.image('war_fac', 'images/war_fac.png');
  game.load.image('war_fac_enemy', 'images/war_fac_enemy.png');
  game.load.image('barracks', 'images/barracks.png');
  game.load.image('barracks_enemy', 'images/barracks_enemy.png');
  
  game.load.audio('explode', 'audio/explode.mp3');
  game.load.audio('agony', 'audio/agony.mp3');
  game.load.audio('tank_fire', 'audio/tank_fire.mp3');
  game.load.audio('m16', 'audio/m16.mp3');
  game.load.audio('training', 'audio/training.mp3');
  game.load.audio('training_complete', 'audio/training_complete.mp3');
  game.load.audio('building', 'audio/building.mp3');
  game.load.audio('unit_ready', 'audio/unit_ready.mp3');
  
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
 
  game.world.setBounds(0, 0, 10000, windowSize.y);

  // Add a bunch of tanks
  for (var i = 300; i < 1000; i += 300) {
    units.push(NewTank(i, 'player'));
  }
  // Add some enemy tanks
  for (var i = 1000; i < 2000; i += 300) {
    units.push(NewTankEnemy(i, 'cpu'));
  }
  // Add buildings
  buildings.push(NewBarracks(250, 'player', NewMarine));
  buildings.push(NewFactory(500, 'player', NewTank));
  
  buildings.push(NewBarracks(game.world.bounds.width - 1000, 'cpu', NewMarineEnemy));
  buildings.push(NewFactory(game.world.bounds.width - 750, 'cpu', NewTankEnemy));
  
  mouse = new Mouse(game, statusHeight, gameWindowHeight);
}

// Building factory functions
function NewBarracks(x, team, unitFunc) {
  return new Building(game, groups.buildings,
                      'barracks' + (team === 'player' ? '' : '_enemy'),
                      'explode',
                      'training', 'training_complete',
                      200, {x:x, y:statusHeight + gameWindowHeight}, team, unitFunc, 200);
}
function NewFactory(x, team, unitFunc) {
  return new Building(game, groups.buildings,
                      'war_fac' + (team === 'player' ? '' : '_enemy'),
                      'explode',
                      'building', 'unit_ready',
                      300, {x:x, y:statusHeight + gameWindowHeight}, team, unitFunc, 300);
}

// Unit factory functions
function NewTank(x, team) {
  return new Unit(game, groups.units,
                  'tank', 'explode',
                  3.0,
                  20.0, 'tank_fire', 1.0, 400,
                  100,
                  {x:x, y:statusHeight + gameWindowHeight},
                  team);
}
function NewTankEnemy(x, team) {
  return new Unit(game, groups.units,
                  'tank_enemy', 'explode',
                  2.5,
                  20.0, 'tank_fire', 1.0, 400,
                  120,
                  {x:x, y:statusHeight + gameWindowHeight},
                  team);
}
function NewMarine(x, team) {
  return new Unit(game, groups.units,
                  'marine', 'agony',
                  2.4,
                  5.0, 'm16', 2.0, 300,
                  50,
                  {x:x, y:statusHeight + gameWindowHeight},
                  team);
}
function NewMarineEnemy(x, team) {
  return new Unit(game, groups.units,
                  'marine_enemy', 'agony',
                  2.0,
                  5.0, 'm16', 2.0, 300,
                  60,
                  {x:x, y:statusHeight + gameWindowHeight},
                  team);
}

var cameraSpeed = 40;
function update() {
  
  // Select unit on click
  mouse.update(groups.units);
  
  // Auto build
  for (var i = 0; i < buildings.length; i++) {
    buildings[i].build();
  }
  
  for (var i = 0; i < units.length; i++) {
    units[i].update(units, buildings);
    // Check for dead units
    if (units[i].sprite.health <= 0) {
      // play death effects
      units[i].kill(groups.units);
      units.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < buildings.length; i++) {
    buildings[i].update(units);
    // Check for dead buildings
    if (buildings[i].sprite.health <= 0) {
      // play death effects
      buildings[i].kill(groups.buildings);
      buildings.splice(i, 1);
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
  bg.x = game.camera.x * 0.7;
}
