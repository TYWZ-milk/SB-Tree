/**
 * Created by deii66 on 2018/1/30.
 */
var scene,canvas,width,height,renderer,camera,Orbitcontrols,stats,lbbs;
function init() {
   // lbbs = new LBBs();
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
    camera.position.y = 1300;
    camera.position.z = 800;

    Orbitcontrols = new THREE.OrbitControls( camera, renderer.domElement );

    initStats();
    initScene();
    initObject();
    animate();
}
function initStats() {

    stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // 放在左上角
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

    return stats;
}
//初始化场景
function initScene() {
    scene.add(loadGround());
    scene.add(loadSky());
}
function animate() {
    Orbitcontrols.update();
    stats.update();
    renderer.clear();
    renderer.render(scene,camera);
    //lbbs.update();
    requestAnimationFrame(animate);
}
