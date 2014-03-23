var windowSize = { x: 1152, y: 480 };
var game = new Phaser.Game(windowSize.x, windowSize.y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var mouse;
var bg;
var units = [];
var buildings = [];
var cursors;
var credits;
var buttons = {};
var creditsEnemy = 5000;
var enemyState = {
  trucks: 0,
  marineTankCounter: 0,
  army: 0
};

// Layout: statusbar, game window, build bars
var statusHeight = 50;
var gameWindowHeight = 280;
var groundY = statusHeight + gameWindowHeight;

// Groups
// Create them ourselves because we need to control the Z order
var groups;

var music;

function preload () {
  game.load.image('bgimage', 'images/bg.jpg');
  game.load.image('brushed', 'images/brushed.jpg');
  game.load.image('marine_button', 'images/marine_button.jpg');
  game.load.image('tank_button', 'images/tank_button.jpg');
  game.load.image('truck_button', 'images/truck_button.jpg');
  
  game.load.audio('bgaudio', 'audio/bg.mp3');
  
  game.load.image('frame', 'images/frame.png');
  game.load.image('selection', 'images/selection.png');
  game.load.image('shade', 'images/shade.png');
  game.load.image('health', 'images/health.png');
  game.load.image('mana', 'images/mana.png');
  game.load.image('health_back', 'images/health_back.png');
  game.load.image('cap_left', 'images/cap_left.png');
  game.load.image('cap_right', 'images/cap_right.png');
  game.load.spritesheet('digits', 'images/digits.png', 32, 32);
  game.load.image('ore', 'images/ore.png');
  game.load.image('sabot', 'images/sabot.png');
  game.load.image('bullet', 'images/bullet.png');
  game.load.image('tank', 'images/tank.png');
  game.load.image('tank_enemy', 'images/tank_enemy.png');
  game.load.image('marine', 'images/marine.png');
  game.load.image('marine_enemy', 'images/marine_enemy.png');
  game.load.image('truck', 'images/truck.png');
  game.load.image('truck_enemy', 'images/truck_enemy.png');
  game.load.image('war_fac', 'images/war_fac.png');
  game.load.image('war_fac_enemy', 'images/war_fac_enemy.png');
  game.load.image('barracks', 'images/barracks.png');
  game.load.image('barracks_enemy', 'images/barracks_enemy.png');
  game.load.image('refinery', 'images/refinery.png');
  game.load.image('refinery_enemy', 'images/refinery_enemy.png');
  
  game.load.audio('collect', 'audio/collect.mp3');
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
    ore: game.add.group(),
    units: game.add.group(),
  };
 
  game.world.setBounds(0, 0, 10000, windowSize.y);
  
  // Credits
  var topbg = game.add.sprite(0, 0, 'brushed');
  topbg.fixedToCamera = true
  topbg.cameraOffset.y = -100;
  credits = new Credits(game, 9, 9);
  credits.addCredits(5000);

  // Add a bunch of tanks
  /*for (var i = 1000; i < 1500; i += 150) {
    units.push(NewTank(i, 'player'));
  }*/
  // Add some enemy units
  for (var i = game.world.bounds.width - 500;
       i < game.world.bounds.width - 400;
       i += 100) {
    units.push(NewTankEnemy(i, 'cpu'));
    units.push(NewMarineEnemy(i, 'cpu'));
  }
  // Add buildings
  var barracks = NewBarracks(250, 'player', NewMarine);
  buildings.push(barracks);
  var factory = NewFactory(750, 'player', NewTank);
  buildings.push(factory);
  var refinery = NewRefinery(1250, 'player', NewTruck);
  buildings.push(refinery);
  
  buildings.push(NewBarracks(game.world.bounds.width - 250, 'cpu', NewMarineEnemy));
  buildings.push(NewFactory(game.world.bounds.width - 750, 'cpu', NewTankEnemy));
  buildings.push(NewRefinery(game.world.bounds.width - 1250, 'cpu', NewTruck));
  
  // Add ore patches
  for (var i = 2000; i < game.world.bounds.width - 2000; i += Math.random(2000) + 500) {
    var patchSize = Math.random(800) + 200;
    for (var j = 0; j < patchSize; j += oreWidth) {
      ore = groups.ore.create(i + j, groundY, 'ore');
      ore.anchor.x = 0.5;
      ore.anchor.y = 1;
      ore.health = Math.random(500) + 300;
      oreWidth = ore.width;
    }
  }
  
  // Bottom
  var bottombg = game.add.sprite(0, 0, 'brushed');
  bottombg.fixedToCamera = true;
  bottombg.cameraOffset.y = groundY;
  var x = 10;
  var y = groundY + 10;
  buttons.marine = new BuildButton(game, x, y, 'marine_button', barracks, credits);
  x += buttons.marine.button.width + 10;
  buttons.tank = new BuildButton(game, x, y, 'tank_button', factory, credits);
  x += buttons.tank.button.width + 10;
  buttons.truck = new BuildButton(game, x, y, 'truck_button', refinery, credits);
  
  mouse = new Mouse(game, statusHeight, gameWindowHeight);
}

// Building factory functions
function NewBarracks(x, team, unitFunc) {
  return new Building(game, groups.buildings,
                      'barracks' + (team === 'player' ? '' : '_enemy'),
                      'explode',
                      'training', 'training_complete',
                      200, {x:x, y:groundY}, team,
                      unitFunc, 200, 200);
}
function NewFactory(x, team, unitFunc) {
  return new Building(game, groups.buildings,
                      'war_fac' + (team === 'player' ? '' : '_enemy'),
                      'explode',
                      'building', 'unit_ready',
                      300, {x:x, y:groundY}, team,
                      unitFunc, 600, 500);
}
function NewRefinery(x, team, unitFunc) {
  var b = new Building(game, groups.buildings,
                       'refinery' + (team === 'player' ? '' : '_enemy'),
                       'explode',
                       'building', 'unit_ready',
                       300, {x:x, y:groundY}, team,
                       unitFunc, 1500, 1000);
  b.isRefinery = true;
  return b;
}

// Unit factory functions
function NewTank(x, team) {
  return new Unit(game, groups.units,
                  'tank',
                  'sabot', 1, 100, -50,
                  'explode',
                  3.0,
                  20.0, 'tank_fire', 1.0, 400,
                  100,
                  {x:x, y:groundY},
                  team);
}
function NewTankEnemy(x, team) {
  return new Unit(game, groups.units,
                  'tank_enemy',
                  'sabot', 1, 100, -50,
                  'explode',
                  2.5,
                  20.0, 'tank_fire', 1.0, 400,
                  120,
                  {x:x, y:groundY},
                  team);
}
function NewMarine(x, team) {
  return new Unit(game, groups.units,
                  'marine',
                  'bullet', 5, 20, -40,
                  'agony',
                  2.4,
                  5.0, 'm16', 2.0, 300,
                  50,
                  {x:x, y:groundY},
                  team);
}
function NewMarineEnemy(x, team) {
  return new Unit(game, groups.units,
                  'marine_enemy',
                  'bullet', 5, 20, -40,
                  'agony',
                  2.0,
                  5.0, 'm16', 2.0, 300,
                  60,
                  {x:x, y:groundY},
                  team);
}
function NewTruck(x, team) {
  return new Unit(game, groups.units,
                  'truck'  + (team === 'player' ? '' : '_enemy'),
                  'bullet', 5, 20, -40,
                  'explode',
                  1.5,
                  0, 'm16', 2.0, 300,
                  200,
                  {x:x, y:groundY},
                  team);
}

var cameraSpeed = 40;
function update() {
  
  // Select unit on click
  mouse.update(groups.units);

  for (var i = 0; i < buildings.length; i++) {
    var building = buildings[i];
    if (building.team !== 'player') {
      // Enemy build AI: one truck per 10 units, 2x marines, 1x tank
      var tryBuild = false;
      var buildFunc = function(){};
      if (enemyState.trucks < enemyState.army / 10 + 1) {
        tryBuild = building.isRefinery;
        buildFunc = function() { enemyState.trucks++; };
      } else if (enemyState.marineTankCounter < 2) {
        tryBuild = building.name === 'barracks_enemy';
        buildFunc = function() { enemyState.marineTankCounter++; enemyState.army++; };
      } else {
        tryBuild = building.name === 'war_fac_enemy';
        buildFunc = function() { enemyState.marineTankCounter -= 2; enemyState.army++; };
      }
      if (tryBuild && building.canBuild(creditsEnemy)) {
        building.build();
        creditsEnemy -= building.cost;
        buildFunc();
      }
    } else {
      // Auto build
      var tryBuild = false;//true;
      if (tryBuild && building.canBuild(credits.credits)) {
        building.build();
        credits.addCredits(-building.cost);
      }
    }
  }
  
  for (var i = 0; i < units.length; i++) {
    var unit = units[i];
    unit.update(units, buildings, groups.ore);
    // Check for refining
    if (unit.oreDeposited > 0) {
      if (unit.team === 'player') {
        credits.addCredits(unit.oreDeposited);
      } else {
        // The CPU cheats!
        creditsEnemy += unit.oreDeposited * 1.4;
      }
      unit.oreDeposited = 0;
    }
    // Check for dead units
    if (unit.sprite.health <= 0) {
      if (unit.team !== 'player') {
        if (unit.name == 'truck_enemy') {
          enemyState.trucks--;
        } else {
          enemyState.army--;
        }
      }
      unit.kill(groups.units);
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
  
  credits.update();
  
  buttons.marine.update();
  buttons.tank.update();
  buttons.truck.update();
  
  // Move camera
  if (cursors.right.isDown) {
    game.camera.x += cameraSpeed;
  } else if (cursors.left.isDown) {
    game.camera.x -= cameraSpeed;
  }

  // Parallax
  bg.x = game.camera.x * 0.7;
}
