<template>
  <page-template>
    <template slot="page-header">
      <span class="title">索引访问报表</span>
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
      <button class="btn-primary"  @click="queryList()">
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
      <quote-history v-if="showHistory" :visiable="showHistory" :param="historyParam" @close="showHistory = false;"></quote-history>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import QuoteReportApi from "@/views/oracle/quote-report/quoteReportApi";
import { formatDateTime, exportTableData2, getService } from "@/views/utils/utils";
import QuoteReportHistoryPage from "@/views/oracle/quote-report/components/QuoteReportHistoryPage";
export default {
  mixins: [Mixins],
  name: "QuoteReportPage",
  components: {
    "mh-tabs": Tabs,
    'quote-history': QuoteReportHistoryPage
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
      selectVal: 'owner',
      searchStr: '',
      sortDirection: '-',
      sortBy: 'gmt_create',
      showHistory: false,
      historyParam: {},
      conditionNameList: [
        {
          label: '所有者',
          value: 'owner'
        },

        {
          label: '表名',
          value: 'table_name'
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
            tooltip: true,
            field: 'gmt_create',
            sortable: true
          },
          {
            getContent: item => _this.getField("owner", item),
            getHeaderContent: "创建者",
            tooltip: true,
            field: 'owner',
            sortable: true
          },
          {
            getContent: item => _this.getField("table_name", item),
            getHeaderContent: "表名",
            tooltip: true,
            field: 'table_name',
            sortable: true
          },
          {
            getContent: item => _this.getField("total_size", item),
            getHeaderContent: "存储(MB)",
            tooltip: true,
            field: 'total_size',
            sortable: true
          },
          {
            getContent: item => _this.getField("sql_total", item),
            getHeaderContent: "SQL总数",
            tooltip: true,
            field: 'sql_total',
            sortable: true
          },
          {
            getContent: item => _this.getField("ind_total", item),
            getHeaderContent: "索引数",
            tooltip: true,
            field: 'ind_total',
            sortable: true
          },
          {
            getContent: item => _this.getField("redu_total", item),
            getHeaderContent: "冗余数",
            tooltip: true,
            field: 'redu_total',
            sortable: true
          },
          {
            getContent: item => _this.getField("ind_used", item),
            getHeaderContent: "使用数",
            tooltip: true,
            field: 'ind_used',
            sortable: true
          },
          {
            getContent: item => _this.getField("ind_unused", item),
            getHeaderContent: "未用数",
            tooltip: true,
            field: 'ind_unused',
            sortable: true
          },
          {
            getContent: item => _this.getField("col_avg", item),
            getHeaderContent: "最大字段",
            tooltip: true,
            field: 'col_avg',
            sortable: true
          },
          {
            getContent: item => _this.getField("col_avg", item),
            getHeaderContent: "平均字段",
            tooltip: true,
            field: 'col_avg',
            sortable: true
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
     return  QuoteReportApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0] && _this.tabs[0].value;
      })
    },
    //切换Tab页
    toggleTab(tab) {
      let _this = this;
      if(_this.currSelectTab === tab.value) return;
      _this.currSelectTab = tab.value;
      _this.queryList();
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
        sort: `${_this.sortDirection}${_this.sortBy}`,
        service: _this.currSelectTab
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "owner",
          "table_name",
          "ind_total",
          "ind_unused",
          "ind_used",
          "col_avg",
          "col_max",
          "sql_total",
          "total_size"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    //查询表格数据
    queryList() {
      let _this = this;
      _this.loading = true;
      QuoteReportApi.queryList(_this.getCondition()).then(resp => {
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
    //排序
    handleSort(sort) {
      let _this = this;
      _this.sortDirection = sort.order ===  'ascending' ? '+' : '-';
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