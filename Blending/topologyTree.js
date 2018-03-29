/**
 * Created by deii66 on 2018/1/30.
 */
var ptree1=[],ptree2=[],blendtree=[];//增添零枝干后的树1树2
var branch;
var tree = [];
var forest = [];
//平移treegeo
function moveTree(tree,x,y){
    for(var i=0; i <tree.length;i++){
        tree[i].position.x -= x*230;
        tree[i].position.z -= y*230;
        scene.add(tree[i]);
    }
}
function originalTree(){
    tree = [];
    compact(tree1);
    drawTree(tree1);
    moveTree(tree,-5,-5);

    tree = [];
    compact(tree2);
    drawTree(tree2);
    moveTree(tree,5,5);
}
//数组转换为拓扑结构
function topologyTree(tree1,tree2){

    //originalTree();
    reusableSet();
    addZero(tree1,tree2);
    console.time("sort");
    for(var total= 0,col= -10,row=-10;total<forestSize;total++) {
        if(total%2==0) {
            tree = [];
            var temp = blendtree;
            blendtree = [];
            if (total == 0)
                blending(ptree1, ptree2);
            else if (total < forestSize / 2)
                blending(temp, ptree1);
            else
                blending(temp, ptree2);
            compact(blendtree);
            addLeaf(blendtree);
            drawTree(blendtree);
            ptree1 = blendtree;
            //var tree = new THREE.Mesh(treegeo,material);
            //scene.add(tree);
            moveTree(tree, col, row);
        }
        else{
            var clonetree = [];

            moveTree(clonetree,col,row);

        }
        //objectGroup.push(tree);
        //tree.position.x=col*400;
        //tree.position.z=row*400;
        col++;
        if(col == 11){
            col=-10;
            row++;
        }
    }
    console.timeEnd("sort");
    //console.log(reusenumber);
}
//数据预处理 包括添加零枝干、零枝干层、不同层处理
function addZero(tree1,tree2){
    var layer = [];
    ptree1 = tree1;
    ptree2 = tree2;
    if(ptree2.length!=ptree1.length){
        if(ptree2.length > ptree1.length && ptree2[ptree2.length-2].length < ptree1[ptree1.length-1].length){
            var interval = parseInt(ptree1[ptree1.length-1].length/ptree2[ptree2.length-2].length);
            for(var i=0;i<ptree2[ptree2.length-1].length;i++){
                ptree2[ptree2.length-1][i].child=child*interval;
            }
        }
        if(ptree2.length < ptree1.length && ptree1[ptree1.length-2].length < ptree2[ptree2.length-1].length){
            var interval = parseInt(ptree2[ptree2.length-1].length/ptree1[ptree1.length-2].length);
            for(var i=0;i<ptree1[ptree1.length-1].length;i++){
                for(var j=0;j<ptree1[ptree1.length-1][i].length;j++)
                    ptree1[ptree1.length-1][i][j].child=parseInt(ptree1[ptree1.length-1][i][j].child)*interval;
            }
        }
    }
    for(var i=0 ; i<tree1.length||i<tree2.length;i++){
        var interval;
        var dvalue;
        layer = [];
        if(i>=tree1.length){
            for(var j=0;j<tree2[i].length;j++){
                layer[j]='0';
            }
            ptree1.push(layer);
        }
        else if(i>=tree2.length){
            for(var j=0;j<tree1[i].length;j++){
                layer[j]='0';
            }
            ptree2.push(layer);
        }
        else if(tree1[i].length > tree2[i].length){
            interval = parseInt(tree1[i].length/tree2[i].length)+1;
            dvalue = parseInt(tree1[i].length - tree2[i].length);
            for(var j= 0,n=0; j<tree1[i].length; j++){
                if(j%interval!=0 && dvalue!=0) {
                    layer[j] = '0';
                    dvalue--;
                }
                else {
                    layer[j] = tree2[i][n];
                    n++;
                }
                if(layer.length == tree1[i].length)
                    break;
            }
            ptree2[i]=layer;
        }
        else if(tree1[i].length < tree2[i].length){
            interval = parseInt(tree2[i].length/tree1[i].length)+1;
            dvalue = parseInt(tree2[i].length - tree1[i].length);
            for(var j= 0,n=0; j<tree2[i].length; j++){
                if(j%interval!=0 && dvalue!=0) {
                    layer[j] = '0';
                    dvalue--;
                }
                else {
                    layer[j] = tree1[i][n];
                    n++;
                }
                if(layer.length == tree2[i].length)
                    break;
            }
            ptree1[i]=layer;
        }
    }
}
//生成过渡树木层次结构
function blending(ptree1,ptree2){
    var layer = [];
    var trunk;
    for(var i=0;i<ptree1.length||i<ptree2.length;i++){
        if(i==0) {
            layer.push(blendBranch(ptree1[i][0], ptree2[i][0]));
        }
        else{
            for(var j=0; j<ptree1[i].length || j<ptree2[i].length; j++) {
                trunk=compare(blendBranch(ptree1[i][j], ptree2[i][j]),i);
                if(trunk!=null)
                    layer.push(trunk);
            }
        }
        blendtree.push(layer);
        layer = [];
    }
}
//任意两枝干生成过渡枝干
function blendBranch(trunk1,trunk2){
    var position;
    var circle;
    var trunk = [];
    if(trunk2!="0" && trunk1!="0" &&  trunk1.length > trunk2.length){  //保证两枝干节点信息一样多
        var length = trunk1.length - trunk2.length;
        for(var j=0;j<length;j++){
            trunk2.push(trunk2[trunk2.length-1]);
        }
    }
    else if(trunk2!="0" && trunk1!="0"&&  trunk1.length < trunk2.length){
        var length = trunk2.length - trunk1.length;
        for(var j=0;j<length;j++){
            trunk1.push(trunk1[trunk1.length-1]);
        }
    }
    for(var i= 0;i<trunk1.length || i<trunk2.length;i++) {
        if (trunk2 == "0") {
            position = new THREE.Vector3(trunk1[i].pos.x, trunk1[i].pos.y, trunk1[i].pos.z);
            circle = {
                radius: (trunk1[i].radius) / 2,
                pos: position.divideScalar(2),
                child:trunk1[i].child,
                position:trunk1[i].position
            };
        }
        else if (trunk1 == "0") {
            position = new THREE.Vector3(trunk2[i].pos.x, trunk2[i].pos.y, trunk2[i].pos.z);
            circle = {
                radius: (trunk2[i].radius) / 2,
                pos: position.divideScalar(2),
                child:trunk2[i].child,
                position:trunk2[i].position
            }
        }
        else if (i < trunk1.length && i < trunk2.length) {
            position = new THREE.Vector3(trunk1[i].pos.x + trunk2[i].pos.x, trunk1[i].pos.y + trunk2[i].pos.y, trunk1[i].pos.z + trunk2[i].pos.z);
            if(parseInt(trunk1[i].child)>parseInt(trunk2[i].child)) {
                circle = {
                    radius: (trunk1[i].radius + trunk2[i].radius) / 2,
                    pos: position.divideScalar(2),
                    child:trunk1[i].child,
                    position:trunk2[i].position
                };
            }
            else{
                circle = {
                    radius: (trunk1[i].radius + trunk2[i].radius) / 2,
                    pos: position.divideScalar(2),
                    child:trunk2[i].child,
                    position:trunk2[i].position
                };
            }
        }
        trunk.push(circle);
    }
    return trunk;
}
//层次结构转换为树
function drawTree(blendtree){
    for(var i=0;i<blendtree.length;i++) {
        for(var j=0;j<blendtree[i].length;j++) {
            drawBranch(blendtree[i][j]);
        }
    }
}
//添加叶子，先将分层了的tree转变成不分层的数组结构，然后在圆环序列上随机添加叶子
function addLeaf(trunk){
    var treecs = [];
    for(var i=0;i<trunk.length;i++){
        for(var j=0;j<trunk[i].length;j++){
            treecs.push(trunk[i][j]);
        }
    }
    for(var i = 1;i<treecs.length;i++) {
        for(var j = Math.floor(treecs[i].length/2+Math.floor(Math.random()*4 + 1));j<treecs[i].length;j+=Math.floor(Math.random()*3 + 1)) {
            for (var k = Math.floor(Math.random() * 6 + 1); k < 6; k++) {
                var phi = Math.random() * 60 + 20;
                var theta = Math.random() * 360;
                var selfRotate = Math.random() * 360;
                var leaf_size = 20;

                var geo = new THREE.PlaneGeometry(leaf_size, leaf_size);
                var leafMesh = new THREE.Mesh(geo, leafMat);
                leafMesh.geometry.translate(0, leaf_size / 2.0, 0);
                leafMesh.rotateY(theta / 180 * Math.PI);
                leafMesh.rotateZ(phi / 180 * Math.PI);
                leafMesh.rotateY(selfRotate / 180 * Math.PI);
                leafMesh.position.x = treecs[i][j].pos.x;
                leafMesh.position.z = treecs[i][j].pos.z;
                leafMesh.position.y = treecs[i][j].pos.y;
                tree.push(leafMesh);
                forest.push(leafMesh);
            }
        }
    }
}
function drawBranch(trunk) {
    var seg = 5;
    var geo = new THREE.BufferGeometry();
    var vertices = [];
    var _32array = [];
    for(var i = 0, l = trunk.length; i < l-1; i ++){
        var circle = trunk[i];
        for(var s=0;s<seg;s++){//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0,0,0);
            var posx=0,posy=0,posz=0;
            if(i>0) {
                posx = Math.abs(trunk[i].pos.x - trunk[i - 1].pos.x);
                posy = Math.abs(trunk[i].pos.y - trunk[i - 1].pos.y);
                posz = Math.abs(trunk[i].pos.z - trunk[i - 1].pos.z);
            }
            if(i==0){
                posx = Math.abs(trunk[i+1].pos.x - trunk[i].pos.x);
                posy = Math.abs(trunk[i+1].pos.y - trunk[i].pos.y);
                posz = Math.abs(trunk[i+1].pos.z - trunk[i].pos.z);
            }
            if(posx>=posy&&posx>=posz) {
                pos.x = 0;
                pos.y = rd * Math.sin(2 * Math.PI / seg * s);
                pos.z = rd * Math.cos(2 * Math.PI / seg * s);
            }
            if(posz>=posx&&posz>=posy){
                pos.x = rd * Math.sin(2 * Math.PI / seg * s);
                pos.y = rd * Math.cos(2 * Math.PI / seg * s);
                pos.z = 0;
            }
            if(posy>=posz&&posy>=posx) {
                pos.x = rd * Math.cos(2 * Math.PI / seg * s);
                pos.y = 0;
                pos.z = rd * Math.sin(2 * Math.PI / seg * s);
            }
            vertices.push(pos.add(circle.pos));
        }
    }
    vertices.push(trunk[trunk.length-1].pos);
    _32array = translate(vertices);
/*    for(i=0;i<l-1;i++){
        for(s=0;s<seg;s++){
            var v1 = i*seg+s;
            var v2 = i*seg+(s+1)%seg;
            var v3 = (i+1)*seg+(s+1)%seg;
            var v4 = (i+1)*seg+s;

            geo.faces.push(new THREE.Face3(v1,v2,v3));
            geo.faceVertexUvs[0].push([new THREE.Vector2(s/seg,0),new THREE.Vector2((s+1)/seg,0),new THREE.Vector2((s+1)/seg,1)]);
            geo.faces.push(new THREE.Face3(v3,v4,v1));
            geo.faceVertexUvs[0].push([new THREE.Vector2((s+1)/seg,1),new THREE.Vector2((s)/seg,1),new THREE.Vector2((s)/seg,0)]);
        }
    }//add faces and uv*/
    geo.addAttribute( 'position', new THREE.Float32BufferAttribute( _32array, 3 ) );
    geo.computeVertexNormals();
/*    var instancedGeo = new THREE.InstancedBufferGeometry();
    instancedGeo.index = geo.index;
    instancedGeo.attributes = geo.attributes;

    var particleCount = 1;
    var translateArray = new Float32Array( particleCount * 3 );

    for ( var i = 0, i3 = 0, l = particleCount; i < l; i ++, i3 += 3 ) {
        translateArray[ i3 + 0 ] = Math.random() * 10 - 1;
        translateArray[ i3 + 1 ] = Math.random() * 10 - 1;
        translateArray[ i3 + 2 ] = Math.random() * 10 - 1;
    }

    instancedGeo.addAttribute('translate', new THREE.InstancedBufferAttribute( translateArray, 3, 1 ) );
    var shader_material = new THREE.RawShaderMaterial({
        uniforms: {map:{value:branchImg}},
        vertexShader: [
            "precision highp float;",
            "",
            "uniform mat4 modelViewMatrix;",
            "uniform mat4 projectionMatrix;",
            "",
            "attribute vec3 position;",
            "attribute vec3 translate;",
            "",
            "void main() {",
            "",
            "	gl_Position = projectionMatrix * modelViewMatrix * vec4( translate + position, 1.0 );",
            "",
            "}"
        ].join("\n"),
        fragmentShader: [
            "precision highp float;",
            "",
            "void main() {",
            "",
            "	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
            "",
            "}"
        ].join("\n"),
        side: THREE.DoubleSide,
        transparent: false,

    });
   branch = new THREE.Mesh(instancedGeo,shader_material);*/
    branch = new THREE.Mesh(geo,material);
    tree.push(branch);
    forest.push(branch);
}
//点集转换为32Array
function translate(vertices){
    var precision =5;
    var _32array = [];
    for(var i=0;i<vertices.length;i++){
        if((i+1) %5 == 0 && i + 1 != vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i - precision +1].x, vertices[i - precision +1].y, vertices[i - precision +1].z);
            _32array.push(vertices[i + precision].x, vertices[i + precision].y, vertices[i + precision].z);
        }
        else if(i == vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
        }
        else if(i + 1 == vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i- precision +1].x, vertices[i- precision +1].y, vertices[i- precision +1].z);
            _32array.push(vertices[vertices.length-1].x, vertices[vertices.length-1].y, vertices[vertices.length-1].z);
        }
        else if(i + precision >= vertices.length-1){
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i + 1].x, vertices[i + 1].y, vertices[i + 1].z);
            _32array.push(vertices[vertices.length-1].x, vertices[vertices.length-1].y, vertices[vertices.length-1].z);
        }
        else {
            _32array.push(vertices[i].x, vertices[i].y, vertices[i].z);
            _32array.push(vertices[i + 1].x, vertices[i + 1].y, vertices[i + 1].z);
            _32array.push(vertices[i + precision].x, vertices[i + precision].y, vertices[i + precision].z);
        }
    }
    for(var j = vertices.length-2; j>=5;j--){
        if(j % 5 ==0){
            _32array.push(vertices[j].x, vertices[j].y, vertices[j].z);
            _32array.push(vertices[j + precision -1].x, vertices[j + precision -1].y, vertices[j + precision -1].z);
            _32array.push(vertices[j - 1].x, vertices[j - 1].y, vertices[j -1].z);
        }
        else{
            _32array.push(vertices[j].x, vertices[j].y, vertices[j].z);
            _32array.push(vertices[j - 1].x, vertices[j - 1].y, vertices[j - 1].z);
            _32array.push(vertices[j - precision -1].x, vertices[j - precision -1].y, vertices[j - precision -1].z);
        }
    }
    return _32array;
}
//紧凑化处理
function compact(blendtree){
    for(var i=1;i<blendtree.length;i++){
        for(var j=0;j<blendtree[i].length;j++){
            var child = parseInt(blendtree[i][j][0].child);
            var position = parseInt(blendtree[i][j][0].position);
            if(position >= blendtree[i-1][child].length)
                position = blendtree[i-1][child].length-1;
            var x = blendtree[i-1][child][position].pos.x - blendtree[i][j][0].pos.x;
            var y = blendtree[i-1][child][position].pos.y - blendtree[i][j][0].pos.y;
            var z = blendtree[i-1][child][position].pos.z - blendtree[i][j][0].pos.z;
            for(var m=0;m<blendtree[i][j].length;m++){
                blendtree[i][j][m].pos.x += x;
                blendtree[i][j][m].pos.y += y;
                blendtree[i][j][m].pos.z += z;
            }
        }
    }
}