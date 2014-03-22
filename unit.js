var Unit = function(game, units, spritename, speed, attackstr, attacksnd, attackspeed, health, pos, team) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.body.width = this.sprite.width * 0.7;
  this.sprite.unit = this;
  units.add(this.sprite);
  
  this.team = team;

  this.sprite.health = health;
  
  this.frameul = game.add.sprite(0, 0, 'frame');
  this.frameur = game.add.sprite(0, 0, 'frame');
  this.frameur.angle = 90;
  this.framedl = game.add.sprite(0, 0, 'frame');
  this.framedl.angle = 270;
  this.framedr = game.add.sprite(0, 0, 'frame');
  this.framedr.angle = 180;
  this.setSelected = function(selected) {
    if (selected === true) {
      console.log("selected");
      // Show selection frame
      this.frameul.revive(1);
      this.frameur.revive(1);
      this.framedl.revive(1);
      this.framedr.revive(1);
    } else {
      // Hide selection frame
      this.frameul.kill();
      this.frameur.kill();
      this.framedl.kill();
      this.framedr.kill();
    }
  };
  
  this.update = function() {
    this.frameul.x = this.sprite.body.x;
    this.frameul.y = this.sprite.body.y;
    this.frameur.x = this.sprite.body.x + this.sprite.body.width;
    this.frameur.y = this.sprite.body.y;
    this.framedl.x = this.sprite.body.x;
    this.framedl.y = this.sprite.body.y + this.sprite.body.height;
    this.framedr.x = this.sprite.body.x + this.sprite.body.width;
    this.framedr.y = this.sprite.body.y + this.sprite.body.height;
  };
};
