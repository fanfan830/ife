/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
var radio=document.getElementsByName("gra-time");
var cityList=document.getElementById("city-select");
var chartWrap=document.getElementsByClassName("aqi-chart-wrap");

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity:"-1",
  nowGraTime: "day"
}
//随机获取颜色
function getRandomColor(argument) {
  // body...
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}
/**
 * 插入dom
 */
function getWidth (width,len) {
      var obj={};
      obj.width=Math.floor(width/(len*2));
      obj.left=Math.floor(width/(len*2));
      obj.leftNum=Math.floor((width-obj.width*(2*len-1))/2);
      return obj;

}
function title (nowtime,i) {
   switch (nowtime) {
       case "day":
         return i;
         break;
        case "week":
          return "第"+i+"周"
         break;
        case "month":
          return "第"+i+"月"
         break;
       default:break;
     }  
}
/**
 * 渲染图表
 */
function renderChart() {
	var wrapper = document.getElementById("aqi-chart-wrap");
  wrapper.style.borderWidth="1px";
  var j=0;
  var select=chartData[pageState.nowGraTime][pageState.nowSelectCity];
  var inner=" ";
  var len=Object.keys(select).length;
  var leftNum=getWidth(wrapper.offsetWidth,len);
  inner+="<div class='title'>"+pageState.nowSelectCity+"空气质量图表</div>";
  for(var key in select)
  {

      var left=leftNum.left*j*2+leftNum.leftNum;
      inner += "<div class='aqi-bar " + pageState.nowGraTime + " titiel="
      +title(pageState.nowGraTime,key)+":"+select[key]+
      "' style='height:" + select[key] + "px; width:"+leftNum.width+"; left:" +
       left+ "px; background-color:" +getRandomColor() + "'></div>";
      inner+="<div class='hint " + pageState.nowGraTime+":"+select[key]+
      "' style='left:" +left+ "px;bottom:"+Math.floor(select[key])+"px;''>"
      +title(pageState.nowGraTime,key)+":[QAI]"+Math.floor(select[key])+"</div>";
      j++;

  }
  wrapper.innerHTML=inner;
  var t=document.getElementsByClassName("aqi-bar");
  var tnext=document.getElementsByClassName("hint");
  for(var i=0;i<t.length;i++){
    
  t[i].addEventListener("mouseover", 
  function() {
    this.nextSibling.style.display="block";
},false)
   t[i].addEventListener("mouseout", 
  function() {
    this.nextSibling.style.display="none";
},false)

}
}


/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
  
  for(var i=0;i<radio.length;i++)
  {
    if(radio[i].checked&&radio[i].value!=pageState.nowGraTime)
    {
      pageState.nowGraTime=radio[i].value;
      renderChart();
      break;
    }
  }
  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
 if(cityList.value!=pageState.nowSelectCity){
        pageState.nowSelectCity=cityList.value;
   }
  renderChart();

}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  for(var i=0;i<radio.length;i++)
  {
    radio[i].checked=false;
  } 
  for(var i=0;i<radio.length;i++)
    {
      radio[i].addEventListener('click', function() {
      graTimeChange();
    },false)
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  cityList.options.add(new Option(" "));
  for(var i in aqiSourceData)
  {
      cityList.options.add(new Option(i));
  }
  cityList.addEventListener('change', function () {
     citySelectChange(); 
  },false)

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  //统计每周平均
  var weekDate={};
  var monthDate={};
  for(var i in aqiSourceData)
  {
    var week={};
    var weekNum=1;
    var weekDay=0;
    for(var j in aqiSourceData[i])
    {
      var d= new Date(j);
      if(d.getDay())
      {
        if(isNaN( week[weekNum]))
        {
          week[weekNum]=0;
        }
        week[weekNum]+=aqiSourceData[i][j];
        weekDay++;
      }
      else
      {
        week[weekNum]/=weekDay;
        weekNum++;
        week[weekNum]=aqiSourceData[i][j];
        weekDay=1;
      }
    }
    week[weekNum]/=weekDay;
    weekDate[i]=week;
  }
  //月数据
  for(var i in aqiSourceData)
  {
    var monthNum=1;
    var monthDay=0;
    var month={};
    for(var j in aqiSourceData[i])
    {
       var d= new Date(j);
      if(d.getMonth()==(monthNum-1))
      {
          if(isNaN(month[monthNum]))
          {
            month[monthNum]=0;
          }
          month[monthNum]+=aqiSourceData[i][j];
          monthDay++;
      }
      else
      {
         month[monthNum]/=monthDay;
         monthNum++;
         month[monthNum]=aqiSourceData[i][j];

      }


    }
    month[monthNum]/=monthDay;
    monthDate[i]=month;
  }
  chartData["day"]=aqiSourceData;
  chartData["week"]=weekDate;
  chartData["month"]=monthDate;


}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
