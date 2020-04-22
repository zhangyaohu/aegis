<template>
  <div class="trend-metric">
    <div class="trend-metric__title">
      <span class="title" style="font-size: 16px;">关键指标趋势</span>
      <mh-tabs
        @tab-click="toggleTab"
        :tabs="tabs"
        v-model="currSelectTab"
        style="display: inline-block;vertical-align: middle;"
      ></mh-tabs>
    </div>
    <div class="trend-metric__search">
      <mh-input
        placeholder="请输入查询信息"
        v-model="searchStr"
        label="请输入查询信息"
        class="mh-inline"
        style="padding-bottom: 0"
      />
      <div class="mh-timePicker">
        <label name="timeRange" class="mh-input__label">请选择日期范围:</label>
        <el-date-picker
          style="border-radius:0 3px 3px 0px;"
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <button class="btn-primary" @click="init()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </div>
    <div class="trend-metric__quota" v-cloak>
      <mh-tabs @tab-click="toggleQuota" :tabs="quotaTabs" v-model="currSelectQuotaTab"></mh-tabs>
    </div>
    <div
      class="trend-metric__chart"
      v-cloak
      v-show="dataSet.length>0"
      v-for="(data, index) in chunkDataSet[pageIndex - 1]"
      :key="index"
    >
      <div class="trend-metric__chart_title">
        Graph Kind: {{data[0].type}} | {{data[0].service}} - 
        <a class="a-link">{{data[0].name}}</a>-
        <a class="a-link">history</a>
      </div>
      <line-metric :value="{data: setMetricData(data)}"></line-metric>
    </div>
    <div class="trend-metric__chart" v-cloak v-show="dataSet.length<=0" style="text-align: center;">
      <span slot="empty" class="table-nodata" style="margin: 7vh 0px;">
        <p class="empty-text" v-text="'暂无数据'"></p>
      </span>
    </div>
      <div class="page-pagination">
        <pagination
          :total="total"
          v-show="total > 0"
          :currentPage="pageIndex"
          @size-change="handleSizeChange"
          :pageSize="pageSize"
          @change="handleCurrentChange"
          :sizes="[5, 10, 15, 20]"
        ></pagination>
      </div>
  </div>
</template>

<script>
import TrendMetricHttpApi from "@/views/oracle/tric-metric/tricMetricApi";
import LineMetric from "@/views/components/metric/LineMetric";
import { formatSize, formatDateTime, getService } from "@/views/utils/utils";
import Tabs from "@/views/components/tab/Tabs";
import _ from "lodash";
export default {
  name: "TrendMetricPage",
  components: {
    "line-metric": LineMetric,
    "mh-tabs": Tabs
  },
  data() {
    return {
      currSelectTab: "",
      currSelectQuotaTab: "core",
      name: "",
      searchStr: '',
      timerInterval: null,
      pageIndex: 1,
      pageSize: 5,
      total: 0,
      colors: [
        {
          line: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#d8ace0"
              },
              {
                offset: 1,
                color: "#d8ace0"
              }
            ],
            globalCoord: false
          },
          start: "rgba(216, 172, 224, 0.1)",
          end: "rgba(216, 172, 224, 0.3)"
        },
        {
          line: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#2175d9"
              },
              {
                offset: 1,
                color: "#2175d9"
              }
            ],
            globalCoord: false
          },
          start: "rgba(33, 117, 217, 0.1)",
          end: "rgba(33, 117, 217, 0.4)"
        },
        {
          line: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#ff0000"
              },
              {
                offset: 1,
                color: "#ff0000"
              }
            ],
            globalCoord: false
          },
          start: "rgba(255, 0, 0, 0.1)",
          end: "rgba(255, 0, 0, 0.2)"
        }
      ],
      timeRange: [new Date(new Date().getTime() - 604800000), new Date()],
      tabs: [],
      quotaTabs: [
        {
          label: "core",
          value: "core"
        },
        {
          label: "host",
          value: "host"
        },
        {
          label: "trans",
          value: "trans"
        },
        {
          label: "network",
          value: "network"
        },
        {
          label: "alert",
          value: "alert"
        }
      ],
      dataSet: [],
      chunkDataSet: [],
      activeSession: {}
    };
  },
  mounted() {
    let _this = this;
    _this.queryService().then(() => {
      _this.init();
      _this.timerInterval = setInterval(() => {
        _this.init();
      }, 5 * 60 * 1000);
    });
  },
  methods: {
    //查询service
    queryService() {
      let _this = this;
      return TrendMetricHttpApi.queryMetric().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0].value;
      });
    },
    //查询条件
    getCondition() {
      let _this = this;
      return {
        tags: _this.currSelectQuotaTab,
        service: _this.currSelectTab,
        starttime: formatDateTime(_this.timeRange[0], "yyyy-MM-dd hh:mm:ss"),
        endtime: formatDateTime(_this.timeRange[1], "yyyy-MM-dd hh:mm:ss"),
        sort: "-name",
        search: _this.searchStr
      };
    },
    //初始化查询
    init() {
      let _this = this;
      //清空查询数据
      _this.dataSet = [];
      _this.pageIndex = 1;
      _this.pageSize = 5;
      TrendMetricHttpApi.queryMetric(_this.getCondition()).then(resp => {
        //数据按照名称分组
        let data = _.groupBy(resp.data, o => {
          return o.name;
        });
        //整理数据
        for (let i in data) {
          _this.dataSet.push(data[i]);
        }
        //将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组
       _this.chunkDataSet =  _.chunk(_this.dataSet, _this.pageSize);
        //总条数
       _this.total = _this.dataSet.length;
      });
    },
    //设置画图数据
    setMetricData(data) {
      let _this = this,
        dataList = [];
      if (!!data) {
        //整理画图数据形式为[[当前值],[最后值],[最近一天]]
        dataList = [
          data.map(item => {
            return {
              time: new Date(item.gmt_modified).getTime(),
              value: item.currval,
              label: "currval"
            };
          }),
          data.map(item => {
            return {
              time: new Date(item.gmt_modified).getTime(),
              value: item.lastval,
              label: "lastval"
            };
          }),
          data.map(item => {
            return {
              time: new Date(item.gmt_modified).getTime(),
              value: item.last1d,
              label: "lastday"
            };
          })
        ];
        return _this.reorganizeData(
          dataList, //对应画图数据
          `${_this.currSelectTab}-${data[0].name}`, //对应图表名称
          formatSize, //对应数据展示格式
          _this.colors, //对应相应颜色
          data[0].sname //对应纵轴名称
        );
      }
    },
    toggleTab(tab) {
      let _this = this;
      if(tab === _this.currSelectTab) return;
      _this.currSelectTab = tab.value;
      _this.pageIndex = 1;
      _this.init();
    },
    toggleQuota(tab) {
      let _this = this;
      if(tab === _this.currSelectQuotaTab) return;
      _this.currSelectQuotaTab = tab.value;
      _this.pageIndex = 1;
      _this.init();
    },
    reorganizeData(dataList, title, func, color, sname) {
      let _this = this,
        avaerage = 0,
        max = 0,
        value = [];
      dataList.forEach((item, index) => {
        let values = [];
        if (!item) item = [];
        //数据按照时间分组
        let data = _.groupBy(item, o => {
          return o.time;
        });
        //遍历时间
        for (let key in data) {
          let _value;
          //按时间分组求和求某一时间下的平均值
          _value =
            _.sumBy(data[key], function(o) {
              return o.value;
            }) / data[key].length;
          values.push({
            time: key,
            value: _value
          });
        }
        //计算平均值与最大值
        if (values.length > 0) {
          avaerage = _.sumBy(values, it => it.value) / values.length;
          let maxValue = values.map(it => it.value);
          max = _.max(maxValue);
        }
        value.push({
          values,
          color: color[index],
          avaerage: avaerage,
          max: max,
          label: item[0].label
        });
      });
      console.log(value);
      return {
        dataList: value,
        title,
        func,
        color,
        sname
      };
    },
    //改变页码
    handleSizeChange(size) {
      let _this = this;
      if(size === _this.pageSize) return;
      _this.pageSize = size;
      _this.pageIndex = 1;
      _this.chunkDataSet = _.chunk(_this.dataSet, _this.pageSize);
    },
    //改变当前页
    handleCurrentChange(pageIndex) {
      let _this = this;
      if(_this.pageIndex === pageIndex) return;
      _this.pageIndex = pageIndex;
    }
  },
  destroyed() {
    let _this = this;
    //消除定时器
    clearInterval(_this.timerInterval);
    _this.timerInterval = null;
  }
};
</script>