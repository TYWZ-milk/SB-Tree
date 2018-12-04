var branchImg;
var leafMat;
var material;
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
function initObject(tree1,tree2){
    branchImg = new THREE.ImageUtils.loadTexture("../textures/tree/diffuse-min.png");
    leafMat = new THREE.MeshLambertMaterial({
        map:THREE.ImageUtils.loadTexture("../textures/tree/leaf01-min.png"),
        color:0x253F08,
        side:THREE.DoubleSide,
        transparent:true,
        depthTest:false
    });
    material = new THREE.MeshLambertMaterial({
        // wireframe:true,
        side:THREE.DoubleSide,
        map:branchImg
    });
    var txt1 = tree1.substr(0,tree1.length-3) + "txtskl";
    var txt2 = tree2.substr(0,tree2.length-3) + "txtskl";
    readFile(txt1,txt2);
}
//获取树木模型的枝干信息并转化为层次信息
var tree1 = [];
var tree2 = [];
function readFile(txt1,txt2){
    var loaderTree1 = new THREE.FileLoader();
    var loaderTree2 = new THREE.FileLoader();
//load a text file a output the result to the console
    loaderTree1.load(
        // resource URL
        txt2,

        // Function when resource is loaded
        function ( data ) {
            var layer = [];
            var circle;
            var x="", y="",z="";
            var radius="";
            var temp=0;
            var branchlength="";
            var trunk=[];
            var child="";
            var position="";
            // output the text to the console
            for(var i=0;i<data.length;i++) {
                temp = 0;
                x="";
                y="";
                z="";
                radius="";
                if(data[i]=='L'){
                    var number=data[i+9].toString();
                    if(data[i+10]!='\r') {
                        number += data[i + 10].toString();
                        if (data[i + 11] != '\r') {
                            number += data[i + 11].toString();
                            i+=14;
                        }
                        else{
                            i+=13;
                        }
                    }
                    else{
                        i+=12;
                    }
                    number = parseInt(number);
                }
                if(data[i+5]=='\r'||data[i+4]=='\r'||data[i+3]=='\r') {
                    branchlength='';
                    child='';
                    position='';
                    while (data[i] != ' ') {
                        child += data[i].toString();
                        i++;
                    }
                    i++;
                    while (data[i] != '\r'){
                        position += data[i].toString();
                        i++;
                    }
                    i+=2;
                    while (data[i] != '\r') {
                        branchlength += data[i].toString();
                        i++;
                    }
                    i += 2;
                }
                for(var j=i;data[j]!='\r'&&j<data.length;j++) {
                    if(data[j]!=' ') {
                        if(temp==0){
                            x+=data[j];
                        }
                        if(temp==1){
                            y+=data[j];
                        }
                        if(temp==2){
                            z+=data[j];
                        }
                        if(temp==3){
                            radius+=data[j];
                        }
                    }
                    else{
                        temp++;
                    }
                }
                i = j+1;
                if(branchlength!=0) {
                    circle = {
                        radius: radius * 70,
                        position:position,//
                        child:child,
                        pos: new THREE.Vector3(x * 70, y * 70, z * 70)
                    };
                    trunk.push(circle);
                    branchlength--;
                    if(branchlength==0){
                        layer.push(trunk);
                        number--;
                        if(number == 0){
                            tree1.push(layer);
                            layer = [];
                        }
                        trunk=[];
                    }
                }
            }
        },

        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // Function called when download errors
        function ( xhr ) {
            console.error( 'An error happened' );
        }
    );

    loaderTree2.load(
        // resource URL
        txt1,

        // Function when resource is loaded
        function ( data ) {
            var layer = [];
            var circle;
            var x="", y="",z="";
            var radius="";
            var temp=0;
            var branchlength="";
            var trunk=[];
            var child="";
            var position="";
            // output the text to the console
            for(var i=0;i<data.length;i++) {
                temp = 0;
                x="";
                y="";
                z="";
                radius="";
                if(data[i]=='L'){
                    var number=data[i+9].toString();
                    if(data[i+10]!='\r') {
                        number += data[i + 10].toString();
                        if (data[i + 11] != '\r') {
                            number += data[i + 11].toString();
                            i+=14;
                        }
                        else{
                            i+=13;
                        }
                    }
                    else{
                        i+=12;
                    }
                    number = parseInt(number);
                }
                if(data[i+5]=='\r'||data[i+4]=='\r'||data[i+3]=='\r') {
                    branchlength='';
                    child='';
                    position='';
                    while (data[i] != ' ') {
                        child += data[i].toString();
                        i++;
                    }
                    i++;
                    while (data[i] != '\r'){
                        position += data[i].toString();
                        i++;
                    }
                    i+=2;
                    while (data[i] != '\r') {
                        branchlength += data[i].toString();
                        i++;
                    }
                    i += 2;
                }
                for(var j=i;data[j]!='\r'&&j<data.length;j++) {
                    if(data[j]!=' ') {
                        if(temp==0){
                            x+=data[j];
                        }
                        if(temp==1){
                            y+=data[j];
                        }
                        if(temp==2){
                            z+=data[j];
                        }
                        if(temp==3){
                            radius+=data[j];
                        }
                    }
                    else{
                        temp++;
                    }
                }
                i = j+1;
                if(branchlength!=0) {
                    circle = {
                        radius: radius * 70,
                        position:position,//
                        child:child,
                        pos: new THREE.Vector3(x * 70, y * 70, z * 70)
                    };
                    trunk.push(circle);
                    branchlength--;
                    if(branchlength==0){
                        layer.push(trunk);
                        number--;
                        if(number == 0){
                            tree2.push(layer);
                            layer = [];
                        }
                        trunk=[];
                    }
                }
            }
            topologyTree(tree1,tree2);
        },

        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // Function called when download errors
        function ( xhr ) {
            console.error( 'An error happened' );
        }
    );
}