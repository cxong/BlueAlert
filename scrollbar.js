var Scrollbar = function(game, x, y) {
  this.backsprite = game.add.sprite(0, 0, 'scroll_back');
  this.backsprite.width = game.width;
  this.backsprite.fixedToCamera = true;
  this.backsprite.cameraOffset.x = x;
  this.backsprite.cameraOffset.y = y;
  this.sprite = game.add.sprite(0, 0, 'scroll');
  this.sprite.fixedToCamera = true;
  this.sprite.cameraOffset.x = x;
  this.sprite.cameraOffset.y = y;
  this.update = function() {
    // update camera position based on mouse click in scroll bar
    var isClick = game.input.mousePointer.isDown &&
      game.input.mousePointer.x >= x && game.input.mousePointer.x < x + this.backsprite.width &&
      game.input.mousePointer.y >= y && game.input.mousePointer.y < y + this.backsprite.height;
    if (isClick) {
      var clickPct = (game.input.mousePointer.x - this.sprite.width / 2) / (this.backsprite.width - this.sprite.width);
      if (clickPct < 0) {
        clickPct = 0;
      } else if (clickPct > 1) {
        clickPct = 1;
      }
      game.camera.x = (game.world.bounds.width - game.width) * clickPct;
    }
    var cameraXPct = game.camera.x / (game.world.bounds.width - game.width);
    this.sprite.cameraOffset.x = cameraXPct * (this.backsprite.width - this.sprite.width);
  };
};