var Unit = function(game, units, spritename, diesnd,
                    speed, attackstr, attacksnd, attackspeed, range, health, pos, team) {
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
  
  var sounds = {
    fire: game.add.audio(attacksnd),
    die: game.add.audio(diesnd)
  };

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
  
  this.attackCounter = 0;
  this.target = null;
  this.attack = function(target) {
    this.target = target;
    this.dest = null;
  }
  
  this.update = function(units, buildings) {
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
        // Find a unit to attack
        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var overlap = unit.sprite.x - range < this.sprite.x &&
              unit.sprite.x + range > this.sprite.x;
          if (overlap && unit.team != this.team && unit.sprite.alive) {
            this.attack(unit);
            break;
          }
        }
        if (this.target == null) {
          // attack buildings
          for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            var overlap = building.sprite.x - range < this.sprite.x &&
              building.sprite.x + range > this.sprite.x;
            if (overlap && building.team != this.team && building.sprite.alive){
              this.attack(building);
              break;
            }
          }
        }
      } else {
        if (this.target.sprite.alive) {
          var overlap = this.target.sprite.x - range < this.sprite.x &&
            this.target.sprite.x + range > this.sprite.x;
          if (!overlap) {
            this.dest = this.target.sprite.x;
          } else {
            this.dest = null;
            // firing
            if (this.attackCounter <= 0) {
              this.attackCounter = 100;
              var volume = (2000 - Math.abs(this.sprite.x - game.camera.x)) / 2000;
              if (volume > 0) {
                sounds.fire.play('', 0, volume);
              }
              this.target.sprite.damage(attackstr);
            }
          }
        } else {
          this.target = null;
        }
      }
    }
    this.attackCounter--;

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
  
  this.kill = function() {
    this.frameGroup.removeAll();
    units.remove(this.sprite);
    var volume = (2000 - Math.abs(this.sprite.x - game.camera.x)) / 2000;
    if (volume > 0) {
      sounds.die.play('', 0, volume);
    }
  };
  
  this.setSelected(false);
};
