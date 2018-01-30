/**
 * Created by deii66 on 2018/1/30.
 */
var ptree1=[],ptree2=[];//增添零枝干后的树1树2
var topotree1,topotree2;//树1 和树2 的拓扑结构
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
    firstLayer();
    nextLayer();
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
//添加零枝干
function addZero(tree1,tree2){
    var layer = [];
    ptree1 = tree1;
    ptree2 = tree2;
    for(var i=0 ; i<tree1.length||i<tree2.length;i++){
        var interval;
        var dvalue;
        layer = [];
        if(tree1[i].length > tree2[i].length){
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