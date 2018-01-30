
function loadSky() {
    //add skybox
    var urlPrefix = "../textures/skybox/";
    var urls = [ urlPrefix + "px.jpg", urlPrefix + "nx.jpg",
        urlPrefix + "py.jpg", urlPrefix + "ny.jpg",
        urlPrefix + "pz.jpg", urlPrefix + "nz.jpg" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    var shader = THREE.ShaderLib["cube"];
    shader.uniforms['tCube'].value= textureCube;   // textureCube has been init before
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : shader.uniforms,
        depthWrite:false,
        side:THREE.BackSide
    });
    // build the skybox Mesh
    // add it to the scene
    return new THREE.Mesh(new THREE.CubeGeometry(100 * 50, 100 * 50, 100 * 50), material);
}

function loadGround() {
    //add ground
    var texture2 = THREE.ImageUtils.loadTexture("../textures/terrain/grasslight-big.jpg");
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(100*50/100,100*50/100);
    var plane = new THREE.PlaneGeometry(5*1000,5000);
    plane.rotateX(-Math.PI/2);
    return new THREE.Mesh(plane, new THREE.MeshLambertMaterial({
        map: texture2
    }));
}
//初始化树木
function initObject(){
    var loader = new THREE.OBJLoader();
    loader.load('../models/Scotch Pine.obj', function(geometry) {
        geometry.traverse(function (child) {
            if(child instanceof THREE.Mesh){
                child.material.depthTest = false;
                child.material.map = THREE.ImageUtils.loadTexture('../textures/tree/timg.jpg');
                child.geometry.computeBoundingSphere();
            }
        });
        geometry.scale.set(100, 100, 100);
        geometry.translateX(500);
        scene.add(geometry);
    });

    loader=new THREE.OBJLoader();
    loader.load('../models/Blue Spruce.obj', function(geometry) {
        geometry.traverse(function (child) {
            if(child instanceof THREE.Mesh){
                child.material.depthTest = false;
                child.material.map = THREE.ImageUtils.loadTexture('../textures/tree/timg.jpg');
                child.geometry.computeBoundingSphere();
            }
        });
        geometry.scale.set(100, 100, 100);
        geometry.translateX(-500);
        scene.add(geometry);
    });

}
