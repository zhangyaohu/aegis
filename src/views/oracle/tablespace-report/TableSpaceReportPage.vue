<template>
  <page-template>
    <template slot="page-header">
      <span class="title">数据字典报表</span>
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
          style="padding: 0px 10px 0px 0px;"
        />
      </span>
      <button class="btn-primary"  @click="pageIndex = 1; queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
      <helper-trigger content="说明: 此处查询可以全模糊匹配,比如要查cps项目所有的表,输入cps即可" />
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="column_info" slot-scope="scope">
          <a class="a-link" @click="!scope.data.handle && handle()">点击查看</a>
        </template>
        <template slot="history" slot-scope="scope">
          <a class="a-link" @click="watchHistory(scope.data)">查看历史</a>
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
    <template  slot="page-footer">
      <table-space-history-page :param="historyParam" v-if="showHistory" :visiable="showHistory" @close="showHistory=false;"></table-space-history-page>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime, getService } from "@/views/utils/utils";
import TableSpaceReportApi from "@/views/oracle/tablespace-report/tableSpaceReportApi";
import TableSpaceHistoryPage from "@/views/oracle/tablespace-report/components/TableSpaceHistoryPage";
export default {
  name: "TableSpaceReportPage",
  mixins: [Mixins],
  components: {
    "mh-tabs": Tabs,
    "table-space-history-page": TableSpaceHistoryPage,
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "",
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      tabs: [],
      itemList: [],
      total: 0,
      sortBy: 'gmt_create',
      sortDirection: '-',
      selectVal: "tablespace",
      searchStr: "",
      showHistory: false,
      historyParam: {

      },
      conditionNameList: [
        {
          label: "表空间",
          value: "tablespace"
        }
      ],
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "更新时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("tablespace", item),
            getHeaderContent: "表空间",
            tooltip: true,
            sortable: true,
            field: 'tablespace'
          },
          {
            getContent: item => _this.getField("total_space", item),
            getHeaderContent: "存储总数(MB)",
            tooltip: true,
            sortable: true,
            field: 'total_space'
          },
          {
            getContent: item => _this.getField("used_space", item),
            getHeaderContent: "使用(MB)",
            tooltip: true,
            sortable: true,
            field: 'used_space'
          },
          {
            getContent: item => _this.getField("free_space", item),
            getHeaderContent: "空闲(MB)",
            tooltip: true,
            sortable: true,
            field: 'free_space'
          },
          {
            getContent: item => _this.getField("diff_space", item),
            getHeaderContent: "增量(MB)",
            tooltip: true,
            sortable: true,
            field: 'diff_space'
          },
          {
            getContent: item => _this.getField("avg_space", item),
            getHeaderContent: "均值(MB)",
            tooltip: true,
            sortable: true,
            field: 'avg_space'
          },
          {
            getContent: item => _this.getField("used_rate", item),
            getHeaderContent: "使用率",
            tooltip: true,
            sortable: true,
            field: 'used_rate'
          },
          {
            getContent: item => _this.getField("used_days", item),
            getHeaderContent: "可用天数",
            tooltip: true,
            sortable: true,
            field: 'used_days'
          },
          {
            getHeaderContent: "历史数据",
            tooltip: true,
            type: "slot",
            slotName: "history"
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
     return  TableSpaceReportApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0] && _this.tabs[0].value;
      })
    },
    //切换Tab页
    toggleTab(tab) {
      let _this = this;
      if (_this.currSelectTab === tab.value) return;
      _this.currSelectTab = tab.value;
      _this.pageIndex = 1;
      _this.queryList();
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        service: _this.currSelectTab,
        [_this.selectVal]: _this.searchStr.trim(),
        sort: `${_this.sortDirection}${_this.sortBy}`
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "tablespace",
          "total_space",
          "used_days",
          "used_rate",
          "used_space",
          "avg_space",
          "diff_space",
          "free_space"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    //查询表格数据
    queryList() {
      let _this = this;
      _this.loading = true;
      TableSpaceReportApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "tableSpaceReport",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.tableSpaceReport;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
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
    },
    //排序
    handleSort(sort) {
      let _this = this;
      if(sort.order)
      _this.sortDirection = sort.order === 'descending' ? '-' : '+';
      _this.sortBy = sort.prop;
      _this.queryList();
    },
    //查看历史
    watchHistory(param) {
      let _this = this;
      _this.historyParam = param;
      _this.showHistory = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>