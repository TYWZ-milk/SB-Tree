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
function reusableSet(){
    var total = [];
    var temp = [];
    for(var i=0;i<tree1.length || i<tree2.length;i++){
        if(i>=tree1.length && i<tree2.length){
            temp = [];
            for(var j=0;j<tree2[i].length;j++){
                temp.push(tree2[i][j]);
            }
            total.push(temp);
        }
        else if(i>=tree2.length && i<tree1.length){
            temp = [];
            for(var j=0;j<tree1[i].length;j++){
                temp.push(tree1[i][j]);
            }
            total.push(temp);
        }
        else if(i<tree1.length && i<tree2.length){
            temp = [];
            for(var j=0;j<tree1[i].length;j++){
                temp.push(tree1[i][j]);
                if((i==1 && j==2) ||(i==2 && j==7)) break;
            }
            for(var j=0;j<tree2[i].length;j++){
                temp.push(tree2[i][j]);
                if((i==1 && j==2) ||(i==2 && j==7)) break;
            }
            total.push(temp);
        }
    }
    var layer = [];
    for(var m=0;m<total.length;m++){
        for(var n=0;n<total[m].length;n++){
            layer.push(movetoOrigin(total[m][n]));
        }
        reusableset.push(layer);
        layer = [];
    }
}
var reusenumber=0;
//将过渡枝干与reusableset中的枝干进行对比
function compare(trunk,layer){
    var ctrunk = movetoOrigin(trunk);
    var child = parseInt(trunk[0].child);
    var position = parseInt(trunk[0].position);
    for(var i=0; i < reusableset[layer].length; i++){
        if(reusableset[layer][i].length == ctrunk.length) {
            var sum = 0;
            for (var j = 0; j < ctrunk.length && j < reusableset[layer][i].length; j++)
                sum += caculate(ctrunk[j].pos, reusableset[layer][i][j].pos);
            if (sum/ctrunk.length < 50) {
                var temp = [];
                for (var m = 0; m < reusableset[layer][i].length; m++) {
                    var radius = parseFloat(reusableset[layer][i][m].radius);
                    var pos = {x: reusableset[layer][i][m].pos.x, y: reusableset[layer][i][m].pos.y, z: reusableset[layer][i][m].pos.z};
                    temp.push({child: child, pos: pos, position: position, radius: radius});
                }
                reusenumber++;
                return temp;
            }
        }
        else if(reusableset[layer][i].length > ctrunk.length) {
            var sum = 0;
            var interval = parseInt(reusableset[layer][i].length / ctrunk.length);
            for (var j = ctrunk.length- 1, m = reusableset[layer][i].length-1; j>=0&&m>=0 ; j--,m-=interval)
                sum += caculate(ctrunk[j].pos, reusableset[layer][i][m].pos);
            if (sum/ctrunk.length < 50) {
                var temp = [];
                for (var m = 0; m < reusableset[layer][i].length; m++) {
                    var radius = parseFloat(reusableset[layer][i][m].radius);
                    var pos = {x: reusableset[layer][i][m].pos.x, y: reusableset[layer][i][m].pos.y, z: reusableset[layer][i][m].pos.z};
                    temp.push({child: child, pos: pos, position: position, radius: radius});
                }
                reusenumber++;
                return temp;
            }
        }
        else if(reusableset[layer][i].length < ctrunk.length) {
            var sum = 0;
            var interval = parseInt(ctrunk.length / reusableset[layer][i].length);
            for (var j = ctrunk.length- 1, m = reusableset[layer][i].length-1; j>=0 && m>=0; j-=interval,m--)
                sum += caculate(ctrunk[j].pos, reusableset[layer][i][m].pos);
            if (sum/reusableset[layer][i].length < 50) {
                var temp = [];
                for (var m = 0; m < reusableset[layer][i].length; m++) {
                    var radius = parseFloat(reusableset[layer][i][m].radius);
                    var pos = {x: reusableset[layer][i][m].pos.x, y: reusableset[layer][i][m].pos.y, z: reusableset[layer][i][m].pos.z};
                    temp.push({child: child, pos: pos, position: position, radius: radius});
                }
                reusenumber++;
                return temp;
            }
        }
    }
    reusableset[layer].push(trunk);
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
