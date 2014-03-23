var Building = function(game, buildings,
                        spritename, diesnd,
                        buildsnd, completesnd,
                        health, pos, team, buildFunc, buildTime) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  buildings.add(this.sprite);
  
  this.team = team;
  this.dest = 10000000;
  if (team !== 'player') {
    this.dest = 0;
  }
  
  var sounds = {
    die: game.add.audio(diesnd),
    build: game.add.audio(buildsnd),
    complete: game.add.audio(completesnd)
  };
  
  this.sprite.health = health;
  this.healthbar = new Healthbar(game);
  
  // Buildings build units
  this.buildCounter = buildTime;
  this.isBuilding = false;
  this.build = function() {
    if (!this.isBuilding) {
      if (this.team === 'player') {
        sounds.build.play();
      }
    }
    this.isBuilding = true;
  }
  this.update = function(units) {
    this.healthbar.update(this.sprite, this.sprite.health / health);
    if (this.isBuilding) {
      this.buildCounter--;
      if (this.buildCounter <= 0) {
        this.buildCounter = buildTime;
        if (buildFunc) {
          var unit = buildFunc(this.sprite.x, this.team);
          units.push(unit);
          unit.moveTo(this.dest);
          if (this.team === 'player') {
            sounds.complete.play();
          }
          this.isBuilding = false;
        }
      }
    }
  };
  
  this.kill = function() {
    this.healthbar.destroy();
    buildings.remove(this.sprite);
    sounds.die.play();
  };
};
