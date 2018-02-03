/**
 * Created by deii66 on 2018/1/30.
 */
var scene,canvas,width,height,renderer,camera,Orbitcontrols,lbbs;
function init() {
    lbbs = new LBBs();
    canvas = document.getElementById("canvas");
    width = window.innerWidth;
    height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvas
    });
    renderer.setSize(width,height);
    renderer.setClearColor(0xaaaaaa,1.0);

    scene = new THREE.Scene();
    scene.frustumCulled = false;
    scene.matrixAutoUpdate = false;

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0,1,1).normalize();
    scene.add(light);
    light = new THREE.AmbientLight(0xffffff,1);
    scene.add(light);


    camera = new THREE.PerspectiveCamera(45,width/height,1,10000);
    camera.position.y = 800;
    camera.position.z = 800;

    Orbitcontrols = new THREE.OrbitControls( camera, renderer.domElement );

    initScene();
    initObject();
    animate();
}

//初始化场景
function initScene() {
    scene.add(loadGround());
    scene.add(loadSky());
}
function animate() {
    Orbitcontrols.update();
    renderer.clear();
    renderer.render(scene,camera);
    lbbs.update();
    requestAnimationFrame(animate);
}
