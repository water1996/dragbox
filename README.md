# 简介 
![拖拽](https://zhouxiaoben.info/src/wp-content/uploads/2020/04/1232321321.gif)   
这是一个基于jquery写的标签拖拽小组件，作为即将毕业的菜鸟程序员，可能代码写得比较low，不过还是有小小的成就感。   
[查看demo](https://water1996.github.io/dragbox/drag.html)  
# 使用
#### 1.新建配置
```
 let option = {
    dragbox: {
      width: '400px',//dragbox宽度，可以设置为百分比
      fontSize: '14px',//字体大小
      backgroundColor: '#87cefa',//dragbox背景颜色
    },
    draglist: {
      listSize: 4, //每行标签个数
      height: '40px', //每个标签高度
      data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7'], //标签数据
      backgroundColor: ['#00ae9d', '#11264f', '#2570a1'],//每个标签背景颜色，多个循环显示
      margin: '1.5%',//标签外边距
    },
  }
```    
#### 2.创建对象
##### 创建一个id为test1的div元素
```
<div id="test1"></div>
```
##### 创建一个dragbox对象，并初始化
```
 let oj = dragbox.init(document.getElementById('test1'))
```  
#### 3.使用第一步设置的配置
```
 oj.setOption(option)
```
#### 4.获取拖拽后的排序数据
```
 console.log(oj.getCurrentData())
 //print:['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']
```
#### 5.绑定拖拽完成后触发的方法(绑定多个，按顺序执行)
```
  function test1() {
    console.log(t1.getCurrentData())
    console.log('执行第一个方法')
  }
  function test2() {
    console.log('执行第二个方法')
  }
   oj.bindFunction(test1, test2)
```
