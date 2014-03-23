var Healthbar = function(game) {
  this.spriteBack = game.add.tileSprite(0, 0, 1, 1, 'health_back');
  this.spriteBack.height = 6;
  this.spriteBack.kill();
  this.sprite = game.add.tileSprite(0, 0, 1, 1, 'health');
  this.sprite.height = 4;
  this.sprite.kill();
  
  this.update = function(unitSprite, healthRatio) {
    this.spriteBack.x = unitSprite.x - unitSprite.body.width / 2;
    this.spriteBack.y = unitSprite.y - unitSprite.height;
    this.spriteBack.width = Math.abs(unitSprite.body.width);
    if (!this.spriteBack.alive) {
      this.spriteBack.revive(1);
    }
    this.sprite.x = unitSprite.x + 1 - unitSprite.body.width / 2;
    this.sprite.y = unitSprite.y + 1 - unitSprite.height;
    this.sprite.width = (Math.abs(unitSprite.body.width) - 2) * healthRatio;
    if (!this.sprite.alive) {
      this.sprite.revive(1);
    }
  };
  
  this.destroy = function() {
    this.sprite.destroy();
    this.spriteBack.destroy();
  };
};