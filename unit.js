var Unit = function(game, units, spritename,
                    bulletsprite, numbullets, muzzlex, muzzley,
                    diesnd,
                    speed, attackstr, attacksnd, attackspeed, range, health, pos, team) {
  this.sprite = game.add.sprite(pos.x, pos.y, spritename);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.body.width = this.sprite.width * 0.7;
  this.sprite.unit = this;
  units.add(this.sprite);
  
  this.emitter = game.add.emitter(0, 0, numbullets);
  this.emitter.makeParticles(bulletsprite);
  this.emitter.gravity = 0
  this.emitter.setRotation(0, 0);
  
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
  this.healthbar = new Healthbar(game);
  if (attackstr == 0) {
    this.manabar = new Manabar(game);
  }
  
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
    if (attackstr == 0) {
      return;
    }
    this.target = target;
    this.dest = null;
  }
  
  this.oreDeposited = 0;
  this.ore = 0;
  this.update = function(units, buildings, ores) {
    if (!this.isHover && !this.isSelected) {
      this.frameGroup.visible = false;
    }
    this.healthbar.update(this.sprite, this.sprite.health / health);
    if (attackstr == 0) {
      this.manabar.update(this.sprite, this.ore / 1000);
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
    
    // Special AI for harvesters:
    // Move towards opposite end and look for ore if not full
    // Return if full
    if (attackstr == 0) {
      if (this.ore >= 1000) {
        if (this.team !== 'player') {
          this.dest = game.world.bounds.width;
        } else {
          this.dest = 0;
        }
      } else {
        if (this.team !== 'player') {
          this.dest = 0;
        } else {
          this.dest = game.world.bounds.width;
        }
      }
      
      // Check for ore
      if (this.ore < 1000) {
        if (this.target == null || !this.target.alive) {
          var closestOre = -1;
          for (var i = 0; i < ores.length; i++) {
            var ore = ores.getAt(i);
            var dist = Math.abs(ore.x - this.sprite.x);
            if ((closestOre === -1 || dist < closestOre) &&
                ore.alive) {
              closestOre = dist;
              this.target = ore;
              this.dest = ore.x;
            }
          }
        }
        if (this.target && this.target.alive) {
          this.dest = this.target.x;
          var overlap = this.target.x - 10 < this.sprite.x &&
            this.target.x + 10 > this.sprite.x;
          if (overlap) {
            this.target.damage(1);
            this.ore++;
          }
        }
      } else {
        // Check for refinery
        for (var i = 0; i < buildings.length; i++) {
          var building = buildings[i];
          var overlap = building.sprite.x - 10 < this.sprite.x &&
            building.sprite.x + 10 > this.sprite.x;
          if (overlap && building.team == this.team && building.sprite.alive &&
              building.isRefinery){
            this.oreDeposited = this.ore;
            this.ore = 0;
            break;
          }
        }
      }
    }
    
    // Stop and attack
    if (!this.forceMove && attackstr > 0) {
      if (this.target == null) {
        // Find a unit to attack
        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var overlap = unit.sprite.x - range * 1.3 < this.sprite.x &&
              unit.sprite.x + range * 1.3 > this.sprite.x;
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
              this.emitter.x = this.sprite.x + muzzlex * this.sprite.scale.x;
              this.emitter.y = this.sprite.y + muzzley;
              var xspeed = 1500.0 * this.sprite.scale.x;
              this.emitter.setXSpeed(xspeed, xspeed);
              this.emitter.setYSpeed(-1, 1);
              this.emitter.start(false, 180, 20, numbullets);
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
    this.healthbar.destroy();
    this.frameGroup.removeAll();
    this.emitter.destroy();
    units.remove(this.sprite);
    var volume = (2000 - Math.abs(this.sprite.x - game.camera.x)) / 2000;
    if (volume > 0) {
      sounds.die.play('', 0, volume);
    }
  };
  
  this.setSelected(false);
};
