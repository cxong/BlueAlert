var Building = function(game, buildings,
                        spritename, diesnd,
                        buildsnd, completesnd,
                        health, pos, team) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  game.physics.arcade.enable(this.sprite);
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
  this.units = [];
  this.addUnit = function(buildFunc, cost, buildTime) {
    this.units.push({
      buildFunc: buildFunc,
      cost: cost,
      buildTime: buildTime,
      buildCounter: buildTime,
      isBuilding: false
    });
  };
  this.canBuild = function(credits, index) {
    return this.sprite.alive && credits >= this.units[index].cost && !this.units[index].isBuilding;
  };
  this.build = function(index) {
    if (!this.sprite.alive) {
      return;
    }
    if (!this.units[index].isBuilding) {
      if (this.team === 'player') {
        sounds.build.play();
      }
    }
    this.units[index].isBuilding = true;
  };
  this.update = function(units) {
    this.healthbar.update(this.sprite, this.sprite.health / health);
    for (var i = 0; i < this.units.length; i++) {
      if (this.units[i].isBuilding) {
        this.units[i].buildCounter--;
        if (this.units[i].buildCounter <= 0) {
          this.units[i].buildCounter = this.units[i].buildTime;
          if (this.units[i].buildFunc) {
            unit = this.units[i].buildFunc(this.sprite.x, this.team);
            units.push(unit);
            unit.moveTo(this.dest);
            if (this.team === 'player') {
              sounds.complete.play();
            }
            this.units[i].isBuilding = false;
            return unit;
          }
        }
      }
    }
    return null;
  };
  
  this.kill = function() {
    this.healthbar.destroy();
    buildings.remove(this.sprite);
    sounds.die.play();
  };
};
