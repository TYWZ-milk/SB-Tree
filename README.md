# SB-Tree
Simple Blending Tree

## 概述
采用`层次化`的方式来实现过渡树木，省去拓扑结构中复杂冗余的步骤。同时采用`重用`的方法来实现轻量级建模。

## 开发环境
[threejs](https://threejs.org/)

## 初步效果
>2018/2/11效果图
![](https://github.com/TYWZ-milk/SB-Tree/raw/master/images/result1.png)
![](https://github.com/TYWZ-milk/SB-Tree/raw/master/images/result2.png)
>以上效果为ALO6a与Blue Spruce两棵树的过渡树木。AL06a与Blue Spruce均为3层树木，图中每棵树均有大约500棵枝干。左右分别为两棵原始树木，中间为过渡树木。

>2018/3/7效果图
![](https://github.com/TYWZ-milk/SB-Tree/raw/master/images/result1_2018.3.7.jpg)
![](https://github.com/TYWZ-milk/SB-Tree/raw/master/images/result2_2018.3.7.jpg)
>以上效果为ALO6a与Blue Spruce两棵树的过渡树木。AL06a与Blue Spruce均为3层树木，图中每棵树均有大约50~100棵枝干。相似度标准为20，加载的树木总数为260棵，未使用clone，圆台精度降低至5，采用了重用，将所有的树木merge到一片森林中。

## 算法实现
* 输入是：三维树木网格数据， T1 and T2。

* 提取树木骨架数据，树木以层次信息存储，每个骨架点存储树木的骨架坐标信息+半径。
* 建立树木枝干之间的对应关系。必要时需增加长度为零的枝干，可以先找两棵各层次枝干数目完全一样的树木，这样就免去增加零枝干。
* 将树木表示成父亲-孩子结构（数据结构中的那个树结构），然后将此时树结构的每条边用n个点表示，按照顺序将所有边的点写进一个高维向量，整颗树木可以用这个高维向量表示。
* T1与T2的middle tree是: midTree(T1,T2) =( vector(T1)+vector(T2) ) / 2.其中vector(T1)是树木T1经过step4后的向量表示， vector(T2)是树木T2经过step4后的向量表示
* 将计算出的middle tree的枝干与原始树木的枝干集合进行相似度匹配，找出形状与之最相似（忽略两棵枝干大小和长度的差别）的枝干，再改变该原始枝干的大小后，添加到场景中。
* midTree(T1, T2) 此时是一个高维向量，按照4的逆过程将其变为一棵三维空间中的树。
* 计算T1与midTree(T1, T2) 的middle tree, 以及midTree(T1, T2) 与T2的middle tree， 此时可以得到T1与T2之间的3棵过渡树木。
* 重复上一步骤，可以得到更多的过渡树木。

## 重用实现
* reusableSet为重用集合，将原始的tree1和tree2按照不同层数分类，将不同层数的枝干集合合并在一起加入到reusableSet。如tree1和tree2的第二层枝干合并在一起加入到reusableSet中的第二层
 
* 将reusableSet中所有枝干平移到原点便于后面比较。
* blendBranch(branch1,branch2)用来计算任意两个枝干的过渡枝干blendbranch。
* 再使用compare(blendbranch,layer)将计算出来的枝干与对应层数的重用集合进行对比。
* compare的过程首先是将blendbranch移动到原点方便与reusableSet中的枝干进行一一相似度对比。
* 对比的方式是求关键点距离和的平均值，若小于20，则将reusableSet中的该枝干取出代替blendbranch，若不小于20，则将该blendbranch加入到重用集合，并继续使用blendbranch。
 
## 2018/3/7更新
目前为实现在前端界面大规模渲染树木，所采用的方法有`视锥剔除`、`枝干圆台精度降低至5`、`clone`、`merge`、`重用`

## 待解决问题
>`重用`问题解决方法不够完美。
>>目前单棵树木的枝干总数已经大大降低，减少到总数低于50以下，所有重用集也相应变少。目前相似度匹配的标准仍是求关键点距离和的平均值，相似标准为低于20。
>>相似标准提高可以在画面加载更多树木，与此同时，树木美观性下降，标准放宽达到50的时候，树木的第三层几乎难以观察到。
>>重用的枝干不能进行方向或大小的改变。
 
 
>界面待优化
>>目前只有3棵树木，而且叶子也没加，纹理还不够美观。
 
 
>性能提高
>>计算过程过慢，性能有待提高。
