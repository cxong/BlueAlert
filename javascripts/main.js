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
var gameState;  // start, playing, end

// Keyboard
var keysPressed = {};
document.addEventListener("keydown", onDocumentKeyDown, false);

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

  if ( gameState == "start" ) {
    splash.render( renderer );
    // Check for key presses
    if ( keysPressed.left || keysPressed.right || keysPressed.up || keysPressed.down ) {
      gameState = "playing";
    }
    return;
  }
  
  if ( gameState == "playing" ) {
    // update
  }

  renderer.clear(true);
	renderer.render(scene, camera);
  
  if ( gameState == "end" ) {
    renderer.setViewport(0, 0, windowWidth, windowHeight);
    loseSplash.render( renderer );
    // Check for key presses
    // Wait a while before reloading to prevent reloading immediately
    // because the player is still pressing keys hectically
    var isStillHectic = clock.elapsedTime - dieTime < 0.5;
    var hasPressed = keysPressed.left || keysPressed.right || keysPressed.up || keysPressed.down;
    if ( !isStillHectic && hasPressed ) {
      start();
    }
  }
  
  keysPressed = {};
}

function onDocumentKeyDown( event ) {
  var keyCode = event.which;
  if ( keyCode == 37 ) {  // left
    keysPressed.left = true;
  } else if ( keyCode == 39 ) { // right
    keysPressed.right = true;
  } else if ( keyCode == 38 ) { // up
    keysPressed.up = true;
  } else if ( keyCode == 40 ) { // down
    keysPressed.down = true;
  } else if ( keyCode == 70 ) { // F
    toggleFullScreen();
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
