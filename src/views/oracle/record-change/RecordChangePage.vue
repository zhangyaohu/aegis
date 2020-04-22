<template>
  <page-template>
    <template slot="page-header">
      <span class="title">记录变更报表</span>
      <mh-tabs
        @tab-click="toggleTab"
        :tabs="tabs"
        v-model="currSelectTab"
        style="display: inline-block;vertical-align: middle;"
      ></mh-tabs>
    </template>
    <template slot="page-toolbar">
      <mh-tabs
        @tab-click="toggleTableTab"
        :tabs="tableTabs"
        v-model="currSelectTableTab"
        style="vertical-align: middle;padding-bottom: 20px;"
      ></mh-tabs>
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
      <button class="btn-primary" @click="pageIndex = 1; queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
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
    <template slot="page-footer">
       <record-change-history-page :param="historyParam" :visiable="showHistory" v-if="showHistory" @close="showHistory = false;"></record-change-history-page>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import {
  formatDateTime,
  exportTableData2,
  getService,
  sizeRound,
  toFixed2
} from "@/views/utils/utils";
import RecordChangeApi from "@/views/oracle/record-change/recordChangeApi";
import RecordChangeHistoryPage from "@/views/oracle/record-change/components/RecordChangeHistoryPage";
export default {
  name: "RecordChangePage",
  mixins: [Mixins],
  components: {
    "mh-tabs": Tabs,
    "record-change-history-page": RecordChangeHistoryPage
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "maxdata1",
      pageIndex: 1,
      pageSize: 10,
      total: 0,
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
      currSelectTableTab: "app",
      historyParam: {},
      showHistory: false,
      tableTabs: [
        {
          label: "应用模式对象",
          value: "app"
        },
        {
          label: "系统模式对象",
          value: "sys"
        }
      ],
      selectVal: "table_name",
      searchStr: "",
      conditionNameList: [
        {
          label: "表名",
          value: "table_name"
        }
      ],
      itemList: [],
      loading: false,
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
            getContent: item => _this.getField("owner", item),
            getHeaderContent: "创建者",
            tooltip: true
          },
          {
            getContent: item => _this.getField("table_name", item),
            getHeaderContent: "表名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("ins_diff", item),
            getHeaderContent: "新增数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("total_dmls", item),
            getHeaderContent: "新增%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("upd_diff", item),
            getHeaderContent: "更新数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("upd_rate", item),
            getHeaderContent: "更新%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("del_diff", item),
            getHeaderContent: "删除数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("del_rate", item),
            getHeaderContent: "删除%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("dml_diff", item),
            getHeaderContent: "DML数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("num_rows", item),
            getHeaderContent: "总行数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("truncated", item),
            getHeaderContent: "trunc",
            tooltip: true
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
    _this.queryService().then(() => {
      _this.queryList();
    });
  },
  methods: {
    //查询service
    queryService() {
      let _this = this;
      return RecordChangeApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0] && _this.tabs[0].value;
      });
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
        owner: _this.currSelectTableTab,
        service: _this.currSelectTab,
        [_this.selectVal]: _this.searchStr.trim()
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "owner",
          "table_name",
          "truncated"
        ];
      if (normalFields.includes(field)) return item[field];
      let normalSizeFields = ['num_rows', 'dml_diff', 'ins_diff', 'upd_diff', 'del_diff'];
      if(normalSizeFields.includes(field)) return sizeRound(item[field])
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
      if (field === "total_dmls")
        return item["dml_diff"] === 0
          ? 0
          : toFixed2(item["ins_diff"] / item["dml_diff"], 2);
      if (field === "upd_rate")
        return item["dml_diff"] === 0
          ? 0
          : toFixed2((item["upd_diff"] / item["dml_diff"]), 2);
      if (field === "del_rate")
        return item["del_diff"] === 0
          ? 0
          : toFixed2((item["del_diff"] / item["dml_diff"]), 2);
    },
    //查询表格数据
    queryList() {
      let _this = this;
      _this.loading = true;
      RecordChangeApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "quoteReport",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.quoteReport;
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
    //切换表格tab页
    toggleTableTab(tab) {
      let _this = this;
      if (_this.currSelectTableTab === tab.value) return;
      _this.currSelectTableTab = tab.value;
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