<template>
  <page-template>
    <template slot="page-header">
      <span class="title">AWR快照报表</span>
      <mh-tabs
        @tab-click="toggleTab"
        :tabs="tabs"
        v-model="currSelectTab"
        style="display: inline-block;vertical-align: middle;"
      ></mh-tabs>
    </template>
    <template slot="page-toolbar">
      <span class="mh-search">
        <el-select v-model="selectVal" class="mh-search__select">
          <el-option
            v-for="(item, index) in conditionNameList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <mh-input
          placeholder="请输入搜索内容"
          v-model="searchStr"
          class="mh-inline"
          inputClass="mh-input__search"
          style="padding: 0px  0px 0px;"
        />
      </span>
      <div class="mh-timePicker">
        <label name="timeRange" class="mh-input__label">请选择日期范围:</label>
        <el-date-picker
          style="border-radius: 0px 3px 3px 0px;max-width: 27rem;"
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <button class="btn-primary" @click="queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="topsql" slot-scope="scope">
          <a class="a-link">top sql report</a>
        </template>
        <template slot="awr" slot-scope="scope">
          <a class="a-link">awr report</a>
        </template>
        <template slot="addm_rptname" slot-scope="scope">
          <a class="a-link">{{scope.data.addm_rptname}}</a>
        </template>
        <template slot="metric" slot-scope="scope">
          <a class="a-link">sys metric report</a>
        </template>
      </mh-table>
      <div class="page-pagination">
        <pagination
          :total="total"
          v-show="total > 0"
          :currentPage="pageIndex"
          @size-change="handleSizeChange"
          :pageSize="pageSize"
          @change="handleCurrentChange"
        ></pagination>
      </div>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime, exportTableData2, getService } from "@/views/utils/utils";
import AwrSnapShotApi from "@/views/oracle/awr-snapshot/awrSnapShotApi";
export default {
  mixins: [Mixins],
  name: "AwrSnapShotPage",
  components: {
    "mh-tabs": Tabs
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "maxdata1",
      timeRange: [new Date(new Date().getTime() - 604800000), new Date()],
      pageIndex: 1,
      pageSize: 10,
      tabs: [
        {
          label: "maxdata1",
          value: "maxdata1"
        },
        {
          label: "maxdata2",
          value: "maxdata2"
        }
      ],
      selectVal: "report_name",
      searchStr: "",
      conditionNameList: [
        {
          label: "ADDM报表",
          value: "report_name"
        }
      ],
      itemList: [],
      loading: false,
      total: 0,
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("id", item),
            getHeaderContent: "快照Id",
            tooltip: true
          },
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "快照开始时间",
            tooltip: true
          },
          {
            getHeaderContent: "TOPSQL报表",
            tooltip: true,
            type: "slot",
            slotName: "topsql"
          },
          {
            getHeaderContent: "AWR报表",
            tooltip: true,
            type: "slot",
            slotName: "awr"
          },
          {
            getHeaderContent: "ADDM报表",
            tooltip: true,
            type: "slot",
            slotName: "addm_rptname"
          },
          {
            getHeaderContent: "METIC报表",
            tooltip: true,
            type: "slot",
            slotName: "metric"
          },
          {
            getContent: item => _this.getField("fscan", item),
            getHeaderContent: "全扫描",
            tooltip: true
          },
          {
            getContent: item => _this.getField("isnew", item),
            getHeaderContent: "新SQL",
            tooltip: true
          },
          {
            getContent: item => _this.getField("iud", item),
            getHeaderContent: "I/U/D",
            tooltip: true
          },
          {
            getContent: item => _this.getField("total", item),
            getHeaderContent: "SQL总数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("end_time", item),
            getHeaderContent: "快照结束时间",
            tooltip: true
          }
        ]
      }
    };
  },
  mounted() {
    let _this = this;
    _this.queryService()
    .then(() => {
      _this.queryList();
    })
  },
  methods: {
    //查询service
    queryService() {
      let _this = this;
     return AwrSnapShotApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0] && _this.tabs[0].value;
      })
    },
    toggleTab(tab) {
      let _this = this;
      if(_this.currSelectTab == tab.value) return;
      _this.currSelectTab = tab.value;
      _this.queryList();
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
        starttime: formatDateTime(_this.timeRange[0], 'yyyy-MM-dd hh:mm:ss'),
        endtime: formatDateTime(_this.timeRange[1], 'yyyy-MM-dd hh:mm:ss'),
        service: _this.currSelectTab
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "id",
          "topsql",
          "awr",
          "addm_rptname",
          "fscan",
          "isnew",
          "total"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "iud") return `${item.ins ? item.ins : ''}/${item.upd ? item.upd : ''}/${item.del ? item.del : ''}`;
      if (field === "end_time" || field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      AwrSnapShotApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "awrShapshot",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.awrShapshot;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    handle() {
      let _this = this;
      _this.openDialog("HandleAlarmDlg", {
        ok: () => {}
      });
    },
    //改变每页条数
    handleSizeChange(size) {
      let _this = this;
      if (size === _this.pageSize) return;
      _this.pageSize = size;
      _this.pageIndex = 1;
      _this.queryList();
    },
    //改变当前页数
    handleCurrentChange(pageIndex) {
      let _this = this;
      if (pageIndex === _this.pageIndex) return;
      _this.pageIndex = pageIndex;
      _this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>