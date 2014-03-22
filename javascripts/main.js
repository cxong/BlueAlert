var clock = new THREE.Clock();
var renderer = new THREE.WebGLRenderer();
var windowWidth = 1152;
var windowHeight = 480;
renderer.setSize(windowWidth, windowHeight);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);

var aspectRatio = windowWidth / windowHeight;
var near = 0.1;
var far = 1000;
var cameraScale = 15;
var camera = new THREE.OrthographicCamera(
		cameraScale * aspectRatio / - 2, cameraScale * aspectRatio / 2,
		cameraScale / 2, cameraScale / - 2, near, far );
camera.position.z = 5;

// Set up scene and objects
var scene = new THREE.Scene();
var game = new Game(windowWidth, windowHeight, 'images/bg.jpg', 5600, 305);
var gameState;  // start, playing, end

// Input
var input = new MouseAndKeyboard(null);

// 
var Sound = function ( source, volume ) {
  var audio = document.createElement( 'audio' );
  audio.volume = volume;
	audio.loop = true;
  var aSource = document.createElement( 'source' );
  aSource.src = source;
  audio.appendChild( aSource );
  this.play = function () {
    audio.load();
    audio.play();
  }
  this.stop = function () {
	audio.pause();
  }
}
var music = new Sound( 'audio/main_menu.ogg', 0.3 );

var splash = new Splash( "images/title.png", 600, 270 );

// Render loop
var counter;

function start() {
  music.play();
  gameState = "start";
}

function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
	
	input.update(delta);
	
	renderer.clear(true);

  if ( gameState == "start" ) {
    splash.render( renderer );
    // Check for key presses
    if ( input.mouseDragOn ) {
      gameState = "playing";
    }
    return;
  }
  
  if ( gameState == "playing" ) {
    // update
		game.update(delta);
		game.render(renderer);
  }
  
  if ( gameState == "end" ) {
    renderer.setViewport(0, 0, windowWidth, windowHeight);
    loseSplash.render( renderer );
    // Check for key presses
    // Wait a while before reloading to prevent reloading immediately
    // because the player is still pressing keys hectically
    var isStillHectic = clock.elapsedTime - dieTime < 0.5;
    var hasPressed = input.mouseDragOn;
    if ( !isStillHectic && hasPressed ) {
      start();
    }
  }
}

function toggleFullScreen() {
  if (THREEx.FullScreen.available()) {
    if( THREEx.FullScreen.activated() ){
      THREEx.FullScreen.cancel();
    }else{
      THREEx.FullScreen.request();
    }
  }
}

start();
render();
