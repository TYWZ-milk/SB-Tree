/**
 * Created by deii66 on 2018/1/30.
 */
var ptree1=[],ptree2=[],blendtree=[];//增添零枝干后的树1树2
var topotree1,topotree2;//树1 和树2 的拓扑结构
var treegeo;//一棵树，包含其枝干
var branch;
function Node(data) {
    this.data = data;
    this.leftNode = null;
    this.rightNode = null;
    this.parentNode = null;
}
function Tree(data) {
    var node = new Node(data);
    this.root = node;
}
//数组转换为拓扑结构
function topologyTree(tree1,tree2){
    addZero(tree1,tree2);
    //firstLayer();
    //nextLayer();
    for(var i=-4;i<5;i++) {
        treegeo = new THREE.Geometry();
        blendtree = [];
        blending();
        compact();
        drawTree();
        ptree1 = blendtree;
        var tree = new THREE.Mesh(treegeo,new THREE.MeshLambertMaterial({
            // wireframe:true,
            side:THREE.DoubleSide,
            map:branchImg
        }));
        scene.add(tree);
        tree.position.x=i*400;
    }
}
//后层拓扑结构处理
function nextLayer(){
    
}
//第一层拓扑结构处理
function firstLayer(){
    if(ptree1[0][0].length>ptree2[0][0].length){
        topotree1 = new Tree(ptree1[0][0][0]);
        var current = topotree1.root;
        var temp = current;
        for(var i=1;i<ptree1[0][0].length ;i++){
            current.leftNode = new Node(ptree1[0][0][i]);
            temp = current;
            current = current.leftNode;
            current.parentNode = temp;
        }
        topotree2 = new Tree(ptree2[0][0][0]);
        current = topotree2.root;
        temp = current;
        for(var i=1;i<ptree1[0][0].length ;i++){
            if(ptree2[0][0][i]!=undefined)
            current.leftNode = new Node(ptree2[0][0][i]);
            else
            current.leftNode = new Node(ptree2[0][0][ptree2[0][0].length-1]);
            temp = current;
            current = current.leftNode;
            current.parentNode = temp;
        }
    }
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
function blending(){
    var layer = [];
    for(var i=0;i<ptree1.length||i<ptree2.length;i++){
        if(i==0) {
            layer.push(compare(blendBranch(ptree1[i][0], ptree2[i][0])));
        }
        else{
            for(var j=0; j<ptree1[i].length || j<ptree2[i].length; j++) {
                layer.push(compare(blendBranch(ptree1[i][j], ptree2[i][j])));
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
            if(trunk1.length<trunk2.length) {
                circle = {
                    radius: (trunk1[i].radius + trunk2[i].radius) / 2,
                    pos: position.divideScalar(2),
                    child:trunk2[i].child,
                    position:trunk2[i].position
                };
            }
            else{
                circle = {
                    radius: (trunk1[i].radius + trunk2[i].radius) / 2,
                    pos: position.divideScalar(2),
                    child:trunk1[i].child,
                    position:trunk1[i].position
                };
            }
        }
        trunk.push(circle);
    }
    return trunk;
}
//层次结构转换为树
function drawTree(){
    for(var i=0;i<blendtree.length;i++) {
        for(var j=0;j<blendtree[i].length;j++) {
            drawBranch(blendtree[i][j]);
        }
    }
}
function drawBranch(trunk) {
    var seg = 30;
    var geo = new THREE.Geometry();
    for(var i = 0, l = trunk.length; i < l; i ++){
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
            geo.vertices.push(pos.add(circle.pos));
        }
    }

    for(i=0;i<l-1;i++){
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
    }//add faces and uv
    geo.computeFaceNormals();
/*    branch = new THREE.Mesh(geo,new THREE.MeshLambertMaterial({
        // wireframe:true,
        side:THREE.DoubleSide,
        map:branchImg
    }));*/
    treegeo.merge(geo);
}
//紧凑化处理
function compact(){
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