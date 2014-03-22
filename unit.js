var Unit = function(game, spritename, speed, attackstr, attacksnd, attackspeed, health, pos, team) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  
  this.team = team;

  this.sprite.health = health;
};
