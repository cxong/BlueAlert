var Mouse = function(game, statusHeight, gameWindowHeight) {
  this.sprite = game.add.sprite(0, 0, 'selection');
  this.sprite.kill();
  this.isDragging = false;
  this.dragStartX = null;
  this.dragEndX = null;
  this.update = function(units) {
    var x = game.input.mousePointer.worldX;
    var y = game.input.mousePointer.worldY;
    if (game.input.mousePointer.isDown &&
        (this.isDragging || (y > statusHeight && y < statusHeight + gameWindowHeight))) {
      this.dragEndX = x;
      // Set start of drag location
      if (!this.isDragging) {
        this.dragStartX = this.dragEndX;
        this.sprite.revive(1);
      }
      this.isDragging = true;
      this.sprite.x = Math.min(this.dragStartX, this.dragEndX);
      this.sprite.y = statusHeight;
      this.sprite.width = Math.abs(this.dragStartX - this.dragEndX);
      this.sprite.body.width = this.sprite.width;
      this.sprite.height = gameWindowHeight;
      this.sprite.body.height = this.sprite.height;
    } else {
      if (this.isDragging) {
        var canSelect = function(unit, selectSprite) {
          return (unit.x - unit.body.width / 2 < selectSprite.x + selectSprite.width &&
              unit.x + unit.body.width / 2 > selectSprite.x) &&
              unit.unit.team == 'player';
        };
        var isClick = Math.abs(this.dragStartX - this.dragEndX) < 10;
        // Select units under mouse
        var numSelected = 0;
        for (var i = 0; i < units.total; i++) {
          var unit = units.getAt(i);
          var overlap = canSelect(unit, this.sprite);
          if (overlap) {
            numSelected++;
          }
        }
        
        // If none selected and not dragged too far,
        // interpret as command
        if (numSelected == 0 && isClick) {
          var targetX = this.dragEndX;
          var delta = 0;
          var target = null;
          for (var i = 0; i < units.total; i++) {
            var unit = units.getAt(i);
            var overlap = (unit.x - unit.body.width / 2 < x &&
              unit.x + unit.body.width / 2 > x);
            if (overlap && unit.unit.team !== 'player') {
              target = unit.unit;
              break;
            }
          }
          for (var i = 0; i < units.total; i++) {
            var unit = units.getAt(i);
            if (unit.unit.isSelected) {
              if (target) {
                unit.unit.attack(target);
              } else {
                unit.unit.moveTo(targetX + delta / 2 * ((delta % 2) ? 1 : -1));
                // Add a bit of random difference so that
                // multiple units don't clump together
                delta += 16;
              }
            }
          }
        } else {
          var firstSelected = false;
          for (var i = 0; i < units.total; i++) {
            var unit = units.getAt(i);
            var overlap = canSelect(unit, this.sprite);
            if (firstSelected && isClick) {
              overlap = false;
            }
            unit.unit.setSelected(overlap);
            if (overlap) {
              firstSelected = true;
            }
          }
        }
        
        this.sprite.kill();
        this.isDragging = false;
      }
    }
    
    // Hover selection
    for (var i = 0; i < units.total; i++) {
      var unit = units.getAt(i);
      var overlap = (unit.x - unit.body.width / 2 < x &&
          unit.x + unit.body.width / 2 > x);
      if (overlap && unit.unit.team === 'player') {
        unit.unit.hover();
      }
    }
  };
};
