<template>
  <Row>
    <Col span="18" offset="3">
      <v-chart class="chart" :option="option" autoresize />
    </Col>
    
  </Row>
</template>

<script setup>
import { api_stock_price } from '@/api/index'
import { useRoute } from 'vue-router'
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { CandlestickChart,LineChart,BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  VisualMapComponent,
  ToolboxComponent,
  BrushComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, reactive, onMounted } from 'vue';

use([
  CanvasRenderer,
  CandlestickChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  VisualMapComponent,
  ToolboxComponent,
  BrushComponent
]);

// provide(THEME_KEY, 'dark');
const downColor = ref('#00da3c');
const upColor = ref('#ec0000');
const data = reactive({values: [], ma5: [], ma10: [], ma20: [], ma30: [], volumes: []})
const stock_name = ref('茅台')
function splitData(rawData) {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i]['trade_date']);
    values.push([rawData[i]['open'], rawData[i]['close'], rawData[i]['low'], rawData[i]['high']]);
    volumes.push([i, rawData[i]['vol'], rawData[i]['open'] > rawData[i]['close'] ? 1 : -1]);
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes
  };
}
function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

// 文档：https://echarts.apache.org/zh/option.html#animation
const option = reactive({
  animation: false,
  legend: {  // 底部组件
    bottom: 10,
    left: 'center',
    data: ['道琼斯', '5日', '10日', '20日', '30日']
  },
  tooltip: {  // 提示框 悬浮框
    trigger: 'axis',  // 触发：坐标轴触发
    axisPointer: {  // 坐标轴提示
      type: 'cross'  // 十字准星指示器
    },
    borderWidth: 1,  // 提示框浮层的边框宽
    borderColor: '#ccc',
    padding: 10,
    textStyle: {
      color: '#000'
    },
    position: function (pos, params, el, elRect, size) {  // 悬浮框的位置
      const obj = {
        top: 10
      };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
      return obj;
    },
    // formatter: function (param) {
    //   param = param[0];
    //   console.log(param)
    //   let index = param.data[0]
      
    //   return [
    //     '日期: ' + param.name + '<hr size=1 style="margin: 3px 0">',
    //     '开盘: ' + data.values[index][0] + '<br/>',
    //     '收盘: ' + data.values[index][1] + '<br/>',
    //     '最低: ' + data.values[index][2] + '<br/>',
    //     '最高: ' + data.values[index][3] + '<br/>',
    //     'MA5: ' + data.ma5[index] + '<br/>',
    //     'MA10: ' + data.ma10[index] + '<br/>',
    //     'MA20: ' + data.ma20[index] + '<br/>',
    //     'MA30: ' + data.ma30[index] + '<br/>',
    //     '交易手: ' + data.volumes[index][1] + '<br/>',
    //   ].join('');
    // }
    // extraCssText: 'width: 170px'
  },
  axisPointer: {  // 这是坐标轴指示器（axisPointer）的全局公用设置。
    link: [
      {
        xAxisIndex: 'all'
      }
    ],
    label: {
      backgroundColor: '#777'
    }
  },
  toolbox: {  // 右上角工具栏
    feature: {
      dataZoom: {  // 数据区域缩放
        yAxisIndex: false  // y轴不缩放
      },
      brush: {  // 选框组件的控制按钮。
        type: ['lineX', 'clear']  // lineX开启横向选框，clear清除选框
      }
    }
  },
  brush: {  // 是区域选择组件
    xAxisIndex: 'all',
    brushLink: 'all',
    outOfBrush: {
      colorAlpha: 0.1
    }
  },
  visualMap: {  // 是视觉映射组件，用于进行『视觉编码』
    show: false,
    seriesIndex: 5,
    dimension: 2,
    pieces: [
      {
        value: 1,
        color: downColor
      },
      {
        value: -1,
        color: upColor
      }
    ]
  },
  grid: [  // 直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴
    {
      left: '10%',
      right: '8%',
      height: '50%'
    },
    {
      left: '10%',
      right: '8%',
      top: '63%',
      height: '16%'
    }
  ],
  xAxis: [  // 直角坐标系 grid 中的 x 轴
    {
      type: 'category',
      data: [],  // 横轴的值，如果不设置，则从data里面获取
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      axisPointer: {
        z: 100
      }
    },
    {
      type: 'category',
      gridIndex: 1,
      data: [],
      boundaryGap: false,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    }
  ],
  yAxis: [  // 直角坐标系 grid 中的 y 轴
    {
      scale: true,
      splitArea: {
        show: true
      }
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    }
  ],
  dataZoom: [  //  组件 用于区域缩放
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 98,
      end: 100
    },
    {
      show: true,
      xAxisIndex: [0, 1],
      type: 'slider',
      top: '85%',
      start: 98,
      end: 100
    }
  ],
  series: [
    {
      name: '道琼斯',
      type: 'candlestick',  // k线图
      data: [],  // 如果系列没有指定 data，并且 option 有 dataset，那么默认使用第一个 dataset。如果指定了 data，则不会再使用 dataset。 数据用一个二维数组表示。如下，每一列被称为一个『维度』。
      itemStyle: {  // 设置阳线填充/阴线填充/阳线边框/阴线边框
        color: upColor,
        color0: downColor,
        borderColor: undefined,
        borderColor0: undefined
      },
      // tooltip: {
      //   formatter: function (param) {
      //     param = param[0];
      //     return [
      //       'd: ' + param.name + '<hr size=1 style="margin: 3px 0">',
      //       'd:d' + param.data[0] + '<br/>',
      //       'd: ' + param.data[1] + '<br/>',
      //       'd: ' + param.data[2] + '<br/>',
      //       'd: ' + param.data[3] + '<br/>'
      //     ].join('');
      //   }
      // }
    },
    {
      name: '5日',
      type: 'line',  // 折线图
      data: calculateMA(5, data),
      smooth: true,
      lineStyle: {
        opacity: 0.5
      }
    },
    {
      name: '10日',
      type: 'line',
      data: calculateMA(10, data),
      smooth: true,
      lineStyle: {
        opacity: 0.5
      }
    },
    {
      name: '20日',
      type: 'line',
      data: calculateMA(20, data),
      smooth: true,
      lineStyle: {
        opacity: 0.5
      }
    },
    {
      name: '30日',
      type: 'line',
      data: calculateMA(30, data),
      smooth: true,
      lineStyle: {
        opacity: 0.5
      }
    },
    {
      name: '交易量',
      type: 'bar',
      xAxisIndex: 1,  // 使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
      yAxisIndex: 1,  // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
      data: []
    }
  ]
})

onMounted(async () => {
  let route = useRoute()
  let ts_code = route.params.tsCode
  
  let response = await api_stock_price({ts_code: ts_code, period: 'daily'})
  // console.log(response.data)
  let _data = splitData(response.data.result)

  let data_length = response.data.result.length
  let start = 0
  let end = 100
  if (data_length < 60){
    start = 0
    end = 100
  } else {
    start = parseInt((data_length-60)*100/data_length)
    end = 100
  }
  option.dataZoom[0]['start'] = start
  option.dataZoom[0]['end'] = end
  option.dataZoom[1]['start'] = start
  option.dataZoom[1]['end'] = end
  console.log(data_length, start, end)

  data.values = _data.values
  data.volumes = _data.volumes
  data.ma5 = calculateMA(5, _data)
  data.ma10 = calculateMA(10, _data)
  data.ma20 = calculateMA(20, _data)
  data.ma30 = calculateMA(30, _data)

  option.xAxis[0].data = _data.categoryData
  option.xAxis[1].data = _data.categoryData
  option.series[0].data = _data.values
  option.series[1].data = data.ma5
  option.series[2].data = data.ma10
  option.series[3].data = data.ma20
  option.series[4].data = data.ma30
  option.series[5].data = _data.volumes
  option.series[0].name = response.data.name
  option.legend['data'][0] = response.data.name
})
</script>

<style scoped>
.form {
  background-color: #fff;
  border-radius: 5px;
  padding: 24px 0 0 0;
  margin: 20px 0;
}
.chart {
  height: calc(100vh - 50px);
}
</style>