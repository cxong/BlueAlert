var Building = function(game, buildings,
                        spritename, diesnd,
                        buildsnd, completesnd,
                        health, pos, team,
                        buildFunc, cost, buildTime) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  buildings.add(this.sprite);
  this.name = spritename;
  
  this.team = team;
  this.dest = game.world.bounds.width;
  if (team !== 'player') {
    this.dest = 0;
  }
  
  this.isRefinery = false;
  
  var sounds = {
    die: game.add.audio(diesnd),
    build: game.add.audio(buildsnd),
    complete: game.add.audio(completesnd)
  };
  
  this.sprite.health = health;
  this.healthbar = new Healthbar(game);
  
  // Buildings build units
  this.cost = cost;
  this.buildTime = buildTime;
  this.buildCounter = buildTime;
  this.isBuilding = false;
  this.canBuild = function(credits) {
    return this.sprite.alive && credits >= this.cost && !this.isBuilding;
  };
  this.build = function() {
    if (!this.sprite.alive) {
      return;
    }
    if (!this.isBuilding) {
      if (this.team === 'player') {
        sounds.build.play();
      }
    }
    this.isBuilding = true;
  };
  this.update = function(units) {
    var unit = null;
    this.healthbar.update(this.sprite, this.sprite.health / health);
    if (this.isBuilding) {
      this.buildCounter--;
      if (this.buildCounter <= 0) {
        this.buildCounter = buildTime;
        if (buildFunc) {
          unit = buildFunc(this.sprite.x, this.team);
          units.push(unit);
          unit.moveTo(this.dest);
          if (this.team === 'player') {
            sounds.complete.play();
          }
          this.isBuilding = false;
        }
      }
    }
    return unit;
  };
  
  this.kill = function() {
    this.healthbar.destroy();
    buildings.remove(this.sprite);
    sounds.die.play();
  };
};
