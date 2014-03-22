var Mouse = function(game) {
  this.sprite = game.add.tileSprite(0, 0, 1, 1, 'selection');
  this.sprite.kill();
  this.isDragging = false;
  this.dragStart = null;
  this.dragEnd = null;
  this.update = function() {
    if (game.input.mousePointer.isDown) {
      this.dragEnd = {x:game.input.mousePointer.worldX, y:game.input.mousePointer.worldY};
      // Set start of drag location
      if (!this.isDragging) {
        console.log('start dragging');
        this.dragStart = this.dragEnd;
      }
      this.isDragging = true;
      this.sprite.x = Math.min(this.dragStart.x, this.dragEnd.x);
      this.sprite.y = Math.min(this.dragStart.y, this.dragEnd.y);
      this.sprite.width = Math.abs(this.dragStart.x - this.dragEnd.x);
      this.sprite.height = Math.abs(this.dragStart.y - this.dragEnd.y);
      this.sprite.revive(1);
      console.log('drag ' + this.sprite.x + '/' + this.sprite.y + ' + ' + this.sprite.width + '/' + this.sprite.height);
    } else {
      console.log('stop dragging');
      this.sprite.kill();
      this.isDragging = false;
    }
  };
};
