var Mouse = function(game, statusHeight, gameWindowHeight) {
  this.sprite = game.add.sprite(0, 0, 'selection');
  game.physics.arcade.enable(this.sprite);
  this.sprite.kill();
  
  var sounds = {
    ready: game.add.audio('ready'),
    affirmative: game.add.audio('affirmative')
  };
  
  this.isDragging = false;
  this.dragStartX = null;
  this.dragEndX = null;
  this.underlay = game.add.sprite(0, 0, 'cursors');
  this.underlay.anchor.x = 0.5;
  this.underlay.anchor.y = 0.5;
  this.hasSelected = false;
  this.update = function(units) {
    var x = game.input.mousePointer.worldX;
    var y = game.input.mousePointer.worldY;
    if (game.input.mousePointer.isDown &&
        (this.isDragging || (y > statusHeight && y < statusHeight + gameWindowHeight))) {
      this.dragEndX = x;
      // Set start of drag location
      if (!this.isDragging) {
        this.underlay.frame = 0;
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
        if (numSelected === 0 && isClick) {
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
          this.hasSelected = false;
          this.underlay.frame = 0;
          for (var i = 0; i < units.total; i++) {
            var unit = units.getAt(i);
            if (unit.unit.isSelected) {
              this.hasSelected = true;
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
          if (this.hasSelected) {
            sounds.affirmative.play();
          }
        } else {
          this.hasSelected = false;
          this.underlay.frame = 0;
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
              this.hasSelected = true;
            }
          }
          if (this.hasSelected) {
            sounds.ready.play();
          }
        }
        
        this.sprite.kill();
        this.isDragging = false;
      }
    }
    
    // Hover selection
    if (this.hasSelected) {
      this.underlay.frame = 1;
    }
    for (var i = 0; i < units.total; i++) {
      var unit = units.getAt(i);
      var overlap = (unit.x - unit.body.width / 2 < x &&
          unit.x + unit.body.width / 2 > x);
      if (overlap) {
        if (unit.unit.team === 'player') {
          this.underlay.frame = 0;
          unit.unit.hover();
        } else {
          this.underlay.frame = 2;
        }
      }
    }
    this.underlay.x = x;
    this.underlay.y = y;
  };
};
