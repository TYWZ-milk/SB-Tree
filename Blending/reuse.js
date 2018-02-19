/**
 * Created by deii66 on 2018/2/8.
 */
var reusableset = [];
//把枝干移动到坐标轴原点
function movetoOrigin(trunk){
    var x = trunk[0].pos.x - 0;
    var y = trunk[0].pos.y - 0;
    var z = trunk[0].pos.z - 0;
    var rtrunk=[];
    for(var m=0;m<trunk.length;m++){
        rtrunk.push(trunk[m]);
    }
    for(var i=0;i<trunk.length;i++){
        rtrunk[i].pos.x = rtrunk[i].pos.x - x;
        rtrunk[i].pos.y -= y;
        rtrunk[i].pos.z -= z;
    }
    return rtrunk;
}
//reusabset为原始树木的枝干移动到零点后的集合
function reusableSet(trunk){
    reusableset.push(movetoOrigin(trunk));
}
//将过渡枝干与reusableset中的枝干进行对比
function compare(trunk){
    var ctrunk = movetoOrigin(trunk);
    var child = parseInt(trunk[0].child);
    var position = parseInt(trunk[0].position);
    for(var i=0; i < reusableset.length; i++){
        var sum = 0;
        for(var j=0 ;j<ctrunk.length && j<reusableset[i].length;j++)
            sum+=caculate(ctrunk[j].pos,reusableset[i][j].pos);
        if(sum <25) {
            var temp = [];
            for(var m=0;m<reusableset[i].length;m++){
                temp.push({child:child,pos:reusableset[i][m].pos,position:position,radius:reusableset[i][m].radius});
            }
            return temp;
        }
    }
    return trunk;
}
function caculate(point1,point2){
    var x1 = eval(point1.x);   // 第一个点的横坐标
    var y1 = eval(point1.y);   // 第一个点的纵坐标
    var z1 = eval(point1.z);
    var x2 = eval(point2.x);   // 第二个点的横坐标
    var y2 = eval(point2.y);   // 第二个点的纵坐标
    var z2 = eval(point2.z);
    var xdiff = x2 - x1;            // 计算两个点的横坐标之差
    var ydiff = y2 - y1;            // 计算两个点的纵坐标之差
    var zdiff = z2 - z1;
    return Math.pow((xdiff * xdiff + ydiff * ydiff + zdiff * zdiff), 0.5);   // 计算两点之间的距离，并将结果返回表单元素
}
