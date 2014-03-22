var Unit = function(game, units, spritename, speed, attackstr, attacksnd, attackspeed, range, health, pos, team) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.body.width = this.sprite.width * 0.7;
  this.sprite.unit = this;
  units.add(this.sprite);
  
  this.team = team;
  // Flip around if not player's units
  if (team !== 'player') {
    this.sprite.scale.x = -1;
  }

  this.sprite.health = health;
  
  this.isSelected = false;
  this.frameul = game.add.sprite(0, 0, 'frame');
  this.frameur = game.add.sprite(0, 0, 'frame');
  this.frameur.angle = 90;
  this.framedl = game.add.sprite(0, 0, 'frame');
  this.framedl.angle = 270;
  this.framedr = game.add.sprite(0, 0, 'frame');
  this.framedr.angle = 180;
  this.frameGroup = game.add.group();
  this.frameGroup.add(this.frameul);
  this.frameGroup.add(this.frameur);
  this.frameGroup.add(this.framedl);
  this.frameGroup.add(this.framedr);
  this.setSelected = function(selected) {
    this.frameGroup.visible = selected;
    if (selected) {
      this.frameGroup.alpha = 1;
    }
    this.isSelected = selected;
  };
  
  this.isHover = false;
  this.hover = function() {
    this.isHover = true;
    if (!this.isSelected) {
      // Show selection frame
      this.frameGroup.visible = true;
      this.frameGroup.alpha = 0.5;
      console.log("hover");
    }
  };
  
  this.forceMove = false;
  
  this.dest = pos.x;
  this.moveTo = function(x) {
    this.dest = x;
    if (this.target) {
      this.forceMove = true;
    } else {
      this.forceMove = false;
    }
    this.target = null;
  };
  
  this.target = null;
  this.attack = function(target) {
    this.target = target;
    this.dest = null;
  }
  
  this.update = function(units) {
    if (!this.isHover && !this.isSelected) {
      this.frameGroup.visible = false;
    }
    this.frameul.x = this.sprite.body.x;
    this.frameul.y = this.sprite.body.y;
    this.frameur.x = this.sprite.body.x + this.sprite.body.width;
    this.frameur.y = this.sprite.body.y;
    this.framedl.x = this.sprite.body.x;
    this.framedl.y = this.sprite.body.y + this.sprite.body.height;
    this.framedr.x = this.sprite.body.x + this.sprite.body.width;
    this.framedr.y = this.sprite.body.y + this.sprite.body.height;
    this.isHover = false;
    
    if (this.team === 'player') {
      // follow player orders
    } else {
      // Basic AI
      // Move towards player's end, attack along the way
      this.dest = 0;
    }
    
    // Stop and attack
    if (!this.forceMove) {
      if (this.target == null) {
        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var overlap = unit.sprite.x - range < this.sprite.x &&
              unit.sprite.x + range > this.sprite.x;
          if (overlap && unit.team != this.team) {
            this.attack(unit);
          }
        }
      } else {
        var overlap = this.target.sprite.x - range < this.sprite.x &&
          this.target.sprite.x + range > this.sprite.x;
        if (!overlap) {
          this.dest = this.target.sprite.x;
        } else {
          this.dest = null;
        }
      }
    }

    // Move towards destination at speed
    if (this.dest != null) {
      if (this.dest > this.sprite.x + speed) {
        this.sprite.scale.x = 1;
        this.sprite.x += speed;
      } else if (this.dest < this.sprite.x - speed) {
        this.sprite.scale.x = -1;
        this.sprite.x -= speed;
      } else {
        this.forceMove = false;
      }
    }
  };
  
  this.setSelected(false);
};
