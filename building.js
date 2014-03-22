var Building = function(game, buildings,
                        spritename, diesnd,
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
  
  var diesound = game.add.audio(diesnd);
  
  this.sprite.health = health;
  
  // Buildings build units
  this.buildCounter = buildTime;
  
  this.update = function(units) {
    this.buildCounter--;
    if (this.buildCounter <= 0) {
      this.buildCounter = buildTime;
      if (buildFunc) {
        var unit = buildFunc(this.sprite.x, this.team);
        units.push(unit);
        unit.moveTo(this.dest);
      }
    }
  };
  
  this.kill = function() {
    buildings.remove(this.sprite);
    sounds.die.play();
  };
};
