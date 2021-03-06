var windowSize = { x: 1152, y: 480 };
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
var gameState = 'play';
var splash;
var scrollbar;

// Layout: statusbar, game window, build bars
var statusHeight = 50;
var gameWindowHeight = 280;
var groundY = statusHeight + gameWindowHeight;

// Groups
// Create them ourselves because we need to control the Z order
var groups;

var music;

var tooltip;


function preload () {
  game.load.image('bgimage', 'images/bg.jpg');
  game.load.image('victory', 'images/victory.jpg');
  game.load.image('defeat', 'images/defeat.jpg');
  game.load.image('brushed', 'images/brushed.jpg');
  game.load.image('scroll_back', 'images/scroll_back.jpg');
  game.load.image('scroll', 'images/scroll.png');
  game.load.image('marine_button', 'images/marine_button.jpg');
  game.load.image('jeep_button', 'images/jeep_button.jpg');
  game.load.image('tank_button', 'images/tank_button.jpg');
  game.load.image('truck_button', 'images/truck_button.jpg');
  
  game.load.audio('bgaudio', 'audio/bg.mp3');
  
  game.load.image('frame', 'images/frame.png');
  game.load.image('selection', 'images/selection.png');
  game.load.spritesheet('cursors', 'images/cursors.png', 40, 40);
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
  game.load.image('jeep', 'images/jeep.png');
  game.load.image('jeep_enemy', 'images/jeep_enemy.png');
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
  game.load.audio('browning', 'audio/browning.mp3');
  game.load.audio('m16', 'audio/m16.mp3');
  game.load.audio('ready', 'audio/ready.mp3');
  game.load.audio('affirmative', 'audio/affirmative.mp3');
  game.load.audio('training', 'audio/training.mp3');
  game.load.audio('training_complete', 'audio/training_complete.mp3');
  game.load.audio('building', 'audio/building.mp3');
  game.load.audio('unit_ready', 'audio/unit_ready.mp3');
  
  cursors = game.input.keyboard.createCursorKeys();
}

function create () {
  game.stage.backgroundColor = '0x666699';

  var i;
  bg = game.add.sprite(0, statusHeight, 'bgimage');
  
  music = game.add.audio('bgaudio');
  music.play('', 0, 0.3, true);
  
  groups = {
    buildings: game.add.group(),
    ore: game.add.group(),
    units: game.add.group()
  };
 
  game.world.setBounds(0, 0, 10000, windowSize.y);
  
  // Credits
  var topbg = game.add.sprite(0, 0, 'brushed');
  topbg.fixedToCamera = true;
  topbg.cameraOffset.y = -100;
  credits = new Credits(game, 9, 9);
  credits.addCredits(5000);

  // Add a bunch of tanks
  /*for (var i = 1000; i < 1500; i += 150) {
    units.push(NewTank(i, 'player'));
  }*/
  // Add some enemy units
  for (i = game.world.bounds.width - 500;
       i < game.world.bounds.width - 400;
       i += 100) {
    units.push(NewTankEnemy(i, 'cpu'));
    units.push(NewMarineEnemy(i, 'cpu'));
  }
  // Add buildings
  var barracks = NewBarracks(250, 'player', NewMarine);
  buildings.push(barracks);
  var factory = NewFactory(750, 'player', [NewJeep, NewTank]);
  buildings.push(factory);
  var refinery = NewRefinery(1250, 'player', NewTruck);
  buildings.push(refinery);
  
  buildings.push(NewBarracks(game.world.bounds.width - 250, 'cpu', NewMarineEnemy));
  buildings.push(NewFactory(game.world.bounds.width - 750, 'cpu', [NewJeep, NewTankEnemy]));
  buildings.push(NewRefinery(game.world.bounds.width - 1250, 'cpu', NewTruck));
  
  // Add ore patches
  for (i = 2000; i < game.world.bounds.width - 2000; i += Math.random(2000) + 500) {
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
  scrollbar = new Scrollbar(game, 0, groundY);
  var style = { font: "18px Arial", fill: "#dddd33" };
  var x = 10;
  var y = groundY + scrollbar.sprite.height + 10;
  buttons.marine = new BuildButton(game, x, y, 'marine_button', barracks, credits, 0);
  x += buttons.marine.button.width + 10;
  buttons.jeep = new BuildButton(game, x, y, 'jeep_button', factory, credits, 0);
  x += buttons.jeep.button.width + 10;
  buttons.tank = new BuildButton(game, x, y, 'tank_button', factory, credits, 1);
  x += buttons.tank.button.width + 10;
  buttons.truck = new BuildButton(game, x, y, 'truck_button', refinery, credits, 0);

  tooltip = game.add.text(0, 0, "", style);
  // Need to set these after tooltip is created
  buttons.marine.setTooltip(tooltip, 'Marine');
  buttons.jeep.setTooltip(tooltip, 'Jeep');
  buttons.tank.setTooltip(tooltip, 'Tank');
  buttons.truck.setTooltip(tooltip, 'Harvester truck');
  
  mouse = new Mouse(game, statusHeight, gameWindowHeight);
  
  splash = null;
}

// Building factory functions
function NewBarracks(x, team, unitFunc) {
  var b = new Building(game, groups.buildings,
                      'barracks' + (team === 'player' ? '' : '_enemy'),
                      'explode',
                      'training', 'training_complete',
                      200, {x:x, y:groundY}, team);
  b.addUnit(unitFunc, 150, 100);
  return b;
}
function NewFactory(x, team, unitFuncs) {
  var b = new Building(game, groups.buildings,
                      'war_fac' + (team === 'player' ? '' : '_enemy'),
                      'explode',
                      'building', 'unit_ready',
                      300, {x:x, y:groundY}, team);
  var costs = [450, 600];
  var buildtimes = [320, 500];
  for (var i = 0; i < unitFuncs.length; i++) {
    b.addUnit(unitFuncs[i], costs[i], buildtimes[i]);
  }
  return b;
}
function NewRefinery(x, team, unitFunc) {
  var b = new Building(game, groups.buildings,
                       'refinery' + (team === 'player' ? '' : '_enemy'),
                       'explode',
                       'building', 'unit_ready',
                       300, {x:x, y:groundY}, team);
  b.addUnit(unitFunc, 1500, 1000);
  b.isRefinery = true;
  return b;
}

// Unit factory functions
function NewTank(x, team) {
  return new Unit(game, groups.units,
                  'tank',
                  'sabot', 1, 110, -48,
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
                  'sabot', 1, 110, -48,
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
                  'bullet', 5, 30, -40,
                  'agony',
                  2.4,
                  10.0, 'm16', 1.9, 300,
                  50,
                  {x:x, y:groundY},
                  team);
}
function NewMarineEnemy(x, team) {
  return new Unit(game, groups.units,
                  'marine_enemy',
                  'bullet', 5, 30, -40,
                  'agony',
                  2.0,
                  10.0, 'm16', 1.9, 300,
                  60,
                  {x:x, y:groundY},
                  team);
}
function NewJeep(x, team) {
  return new Unit(game, groups.units,
                  'jeep' + (team === 'player' ? '' : '_enemy'),
                  'bullet', 4, 80, -48,
                  'explode',
                  4.0,
                  12.0, 'browning', 2.1, 350,
                  80,
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
  if (gameState === 'play') {
    var i;
    // Select unit on click
    mouse.update(groups.units);
  
    for (i = 0; i < buildings.length; i++) {
      var building = buildings[i];
      if (building.team !== 'player') {
        // Enemy build AI: one truck per 10 units, 3x marines, 2x jeep, 1x tank
        for (var j = 0; j < building.units.length; j++) {
          var tryBuild = false;
          var canBuild = building.canBuild(creditsEnemy, j);
          if (enemyState.trucks < enemyState.army / 10 + 1) {
            tryBuild = building.isRefinery;
            if (tryBuild && canBuild) {
              enemyState.trucks++;
            }
          } else if (enemyState.marineTankCounter <= 3) {
            tryBuild = building.name === 'barracks_enemy';
            if (tryBuild && canBuild) {
              enemyState.marineTankCounter++;
              enemyState.army++;
            }
          } else if (enemyState.marineTankCounter <= 5) {
            tryBuild = building.name === 'war_fac_enemy' && j === 0;
            if (tryBuild && canBuild) {
              enemyState.marineTankCounter++;
              enemyState.army++;
            }
          } else {
            tryBuild = building.name === 'war_fac_enemy' && j === 1;
            if (tryBuild && canBuild) {
              enemyState.marineTankCounter = 0;
              enemyState.army++;
            }
          }
          if (tryBuild && building.canBuild(creditsEnemy, j)) {
            building.build(j);
            creditsEnemy -= building.units[j].cost;
          }
        }
      }
    }
    
    for (i = 0; i < units.length; i++) {
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
    for (i = 0; i < buildings.length; i++) {
      buildings[i].update(units);
      // Check for dead buildings
      if (buildings[i].sprite.health <= 0) {
        // play death effects
        buildings[i].kill(groups.buildings);
        buildings.splice(i, 1);
        i--;
        // Check victory conditions
        var playerAlive = false;
        var enemyAlive = false;
        for (var j = 0; j < buildings.length; j++) {
          if (!buildings[j].sprite.alive) {
            continue;
          }
          if (buildings[j].team === 'player') {
            playerAlive = true;
          } else {
            enemyAlive = true;
          }
        }
        if (!playerAlive) {
          if (splash === null) {
            splash = game.add.sprite(game.camera.x + game.width / 2,
                                     game.camera.y + game.height / 2,
                                     'defeat');
            splash.x -= splash.width / 2;
            splash.y -= splash.height / 2;
            gameState = 'end';
          }
        } else if (!enemyAlive) {
          if (splash === null) {
            splash = game.add.sprite(game.camera.x + game.width / 2,
                                     game.camera.y + game.height / 2,
                                     'victory');
            splash.x -= splash.width / 2;
            splash.y -= splash.height / 2;
            gameState = 'end';
          }
        }
      }
    }
    
    credits.update();
    
    scrollbar.update();
    
    buttons.marine.update();
    buttons.jeep.update();
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
  } else if (gameState === 'end') {
  }
}

var Boot = function (game) {
};

Boot.prototype = {
    create: function () {
        this.game.stage.backgroundColor = 0x00FFF6;
        this.input.maxPointers = 1;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('game');
    }
};

var GameState = function(game){};

GameState.prototype.preload = preload;
GameState.prototype.create = create;
GameState.prototype.update = update;

var game;
window.onload = function() { setTimeout(function () {
  game = new Phaser.Game(
    windowSize.x, windowSize.y, Phaser.AUTO, 'gameContainer', null, false, false
  );
  game.state.add('boot', Boot);
  game.state.add('game', GameState);
  game.state.start('boot');
}, 1000); };
