var Game = function(windowWidth, windowHeight, bgpath, bgwidth, bgheight) {
  this.scene = new THREE.Scene();
  var near = 0.1;
  var far = 1000;
  var cameraScale = 15;
  var aspectRatio = windowWidth / windowHeight;
  this.camera = new THREE.OrthographicCamera(
    cameraScale * aspectRatio / - 2, cameraScale * aspectRatio / 2,
    cameraScale / 2, cameraScale / - 2, near, far );
  this.camera.position.z = 5;
  
  // background
  var matMap = THREE.ImageUtils.loadTexture(bgpath);
  var material = new THREE.MeshBasicMaterial({
    map : matMap
  });
  var geometry = new THREE.PlaneGeometry( bgwidth * 0.03, bgheight * 0.03 );
  this.mesh = new THREE.Mesh( geometry, material );
  this.scene.add( this.mesh );
  
  this.update = function(delta) {
    
  };
  
  this.render = function(renderer) {
    renderer.render(this.scene, this.camera);
  };
};