var Credits = function(game, x, y) {
  this.group = game.add.group();
  this.group.x = x;
  this.group.y = y;
  var capleft = this.group.create(0, 0, 'cap_left');
  capleft.fixedToCamera = true;
  var dx = capleft.width;
  this.digits = [];
  var numDigits = 5;
  for (var i = 0; i < numDigits; i++) {
    var digit = this.group.create(0, 0, 'digits');
    digit.fixedToCamera = true;
    digit.cameraOffset.x = dx;
    digit.frame = 0;
    dx += digit.width;
    this.digits.push(digit);
  }
  var capright = this.group.create(0, 0, 'cap_right');
  capright.fixedToCamera = true;
  capright.cameraOffset.x = dx;
  
  this.lastCredits = 0;
  this.credits = 0;
  this.updateCounter = 0;
  var updateCounterMax = 100;
  this.lastTickedCredits = 0;
  this.addCredits = function(value) {
    this.lastCredits = this.credits;
    this.credits += value;
    if (this.credits >= Math.pow(10, numDigits)) {
      this.credits = Math.pow(10, numDigits) - 1;
    }
    this.updateCounter = updateCounterMax;
  };
  var tickSound = game.add.audio('collect');
  this.update = function() {
    // Display a credits value between last and this
    if (this.updateCounter > 0) {
      var progress = this.updateCounter / updateCounterMax;
      progress = Phaser.Easing.Exponential.In(progress);
      var newCredits = this.lastCredits * progress +
                       this.credits * (1 - progress);
      this.updateDigits(newCredits);
      this.updateCounter--;
      if (this.updateCounter == 0 ||
          Math.abs(this.lastTickedCredits - newCredits) > 2) {
        tickSound.play('', 0, 0.2);
        this.lastTickedCredits = newCredits;
      }
    } else {
      this.updateDigits(this.credits);
    }
  };
  this.updateDigits = function(value) {
    for (var i = 0; i < numDigits; i++) {
      var digit = Math.floor(value / Math.pow(10, numDigits - i - 1)) % 10;
      this.digits[i].frame = digit;
    }
  };
};