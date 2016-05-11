/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

var city=document.getElementById('aqi-city-input');
var qui=document.getElementById('aqi-value-input');
var table=document.getElementById('aqi-table');
var add=document.getElementById('add-btn');

/**
 *失去焦点时判断是否输入合法
 */

city.onblur=function() {
	 var pattern= /^[\u4e00-\u9fa5|a-zA-Z]/;
	 var flag=pattern.test(city.value.trim());
	 if(!flag)
	 {
	 	alert('城市名字必须是中文或英文，请重新输入');
	 	city.value=" ";
	 	city.focus();
	 	

	 }
	 else
	 {
	 	add.disabled=false;
	 }
}

qui.onblur=function() {
	 var pattern= /[0-9]\d*/;
	 var flag=pattern.test(qui.value.trim());
	 if(!flag)
	 {
	 	alert('空气质量必须是数字，请重新输入');
	 	qui.value=" ";
	 	qui.focus();
	 }
	 else
	 {
	 	add.disabled=false;
	 }
}
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */

function addAqiData() { 
	 aqiData[city.value.trim()]=qui.value.trim();
	
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var len=table.rows.length;
	if(len==0)
	{
		var x=table.insertRow(0);
	  	var y=x.insertCell(0);
	  	var z=x.insertCell(1);
	  	var w=x.insertCell(2);
	  	y.innerHTML="城市";
	  	z.innerHTML="空气质量";
	  	w.innerHTML="操作";
	  	len+=1;
  }
  		var tableL=table.insertRow(len);
		var cityL=tableL.insertCell(0);
	  	var data=tableL.insertCell(1);
	  	var del=tableL.insertCell(2);
	  	var b=document.createElement('button');
	  	cityL.innerHTML=city.value.trim();
	  	data.innerHTML=aqiData[city.value.trim()];
	  	b.innerHTML="删除";
	  	del.appendChild(b);
	
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {

  addAqiData();
  renderAqiList();	
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(r) {
  // do sth.
  var i=r.parentNode.parentNode.rowIndex;
  table.deleteRow(i);
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	add.disabled=true;
	add.onclick=function()
	  {  
	      addBtnHandle();
	  }

	table.addEventListener('click', function (e) {

		if(e.target.nodeName=="BUTTON")//e.target获取触发该事件的节点
		{
            delBtnHandle(e.target);

		}
	})

	
}

init();
