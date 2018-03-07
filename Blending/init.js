/**
 * Created by deii66 on 2018/1/30.
 */
var scene,canvas,width,height,renderer,camera,Orbitcontrols,stats,lbbs;
var objectGroup=[];
var forestSize = 370;//森林总数
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
    camera.position.y = 1300;
    camera.position.z = 800;

    Orbitcontrols = new THREE.OrbitControls( camera, renderer.domElement );

    initStats();
    initGui();
    initScene();
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
var controls = new function (){
    this.AL06a = false;
    this.Blue_Spruce = false;
    this.Scotch_Pine = false;
    this.Delete = function(){
        for(var i=0; i<objectGroup.length;i++)
            scene.remove(objectGroup[i]);
        objectGroup = [];
    };
    this.Blend = function (){
        if(this.AL06a == true && this.Blue_Spruce==true){
            initObject("../models/AL06a.obj","../models/Blue Spruce.obj");
        }
        else if(this.AL06a == true && this.Scotch_Pine == true){
            initObject("../models/AL06a.obj","../models/Scotch Pine.obj");
        }
        else if(this.Blue_Spruce == true && this.Scotch_Pine == true){
            initObject("../models/Blue Spruce.obj","../models/Scotch Pine.obj");
        }
    }
};
function initGui(){
    var dataGui = new dat.GUI();
    dataGui.add(controls,'AL06a');
    dataGui.add(controls,'Blue_Spruce');
    dataGui.add(controls,'Scotch_Pine');
    dataGui.add(controls,'Blend');
    dataGui.add(controls,'Delete');
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
    lbbs.update();
    requestAnimationFrame(animate);
}
