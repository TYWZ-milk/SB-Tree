/**
 * Created by deii66 on 2018/2/8.
 */
var reusableset = [];
function reusableSet(trunk){
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
    reusableset.push(rtrunk);
}