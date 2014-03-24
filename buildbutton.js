var BuildButton = function(game, x, y, sprite, building, credits, buildIndex) {
  this.building = building;
  this.buildIndex = buildIndex;
  this.build = function() {
    if (this.building.canBuild(credits.credits, this.buildIndex)) {
      this.building.build(this.buildIndex);
      credits.addCredits(-this.building.units[this.buildIndex].cost);
    }
  };
  this.button = game.add.button(0, 0, sprite, this.build, this);
  this.button.fixedToCamera = true;
  this.button.cameraOffset.x = x;
  this.button.cameraOffset.y = y;
  
  this.unitname = '';
  this.tooltip = null;
  this.showTooltip = false;
  this.onOver = function() {
    this.showTooltip = true;
    this.tooltip.content = this.unitname + ' $' + this.building.units[this.buildIndex].cost;
  };
  this.onOut = function() {
    this.showTooltip = false;
    this.tooltip.content = '';
  };
  this.setTooltip = function(tooltip, unitname) {
    this.unitname = unitname;
    this.tooltip = tooltip;
    this.button.onInputOver.add(this.onOver, this);
    this.button.onInputOut.add(this.onOut, this);
  };
  
  this.shade = game.add.sprite(0, 0, 'shade');
  this.shade.fixedToCamera = true;
  this.shade.kill();
  this.update = function() {
    if (!this.building.sprite.alive) {
      // Dead building; permanently shade
      if (!this.shade.alive) {
        this.shade.revive(1);
        this.shade.cameraOffset.x = this.button.cameraOffset.x;
        this.shade.cameraOffset.y = this.button.cameraOffset.y;
      }
      this.shade.width = this.button.width;
      this.shade.height = this.button.height;
    } else if (this.building.units[this.buildIndex].isBuilding) {
      // draw a shade over the button
      if (!this.shade.alive) {
        this.shade.revive(1);
        this.shade.cameraOffset.x = this.button.cameraOffset.x;
        this.shade.cameraOffset.y = this.button.cameraOffset.y;
        this.shade.width = this.button.width;
      }
      this.shade.height = (this.building.units[this.buildIndex].buildTime - this.building.units[this.buildIndex].buildCounter) / this.building.units[this.buildIndex].buildTime * this.button.height;
    } else if (this.shade.alive) {
      this.shade.kill();
    }
    
    // Update tooltip location
    if (this.showTooltip) {
      this.tooltip.x = game.input.mousePointer.worldX + 16;
      this.tooltip.y = game.input.mousePointer.worldY + 16;
    }
  };
};