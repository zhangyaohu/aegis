<template>
  <page-template>
    <template slot="page-header">
      <span class="title">索引访问报表</span>
      <mh-tabs @tab-click="toggleTab" :tabs="tabs" v-model="currSelectTab" style="display: inline-block;vertical-align: middle;"></mh-tabs>
    </template>
    <template slot="page-toolbar">
       <mh-tabs
        @tab-click="toggleTableTab"
        :tabs="tableTabs"
        v-model="currSelectTable"
        style="padding-bottom: 10px;"
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
      <button class="btn-primary"  @click="search()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
      <helper-trigger v-if="currSelectTable !== 'nobind'" :content="content" />
    </template>
    <template slot="page-table">
      <mh-table v-if="currSelectTable === 'quote'" :data-source="dataSource" :loading="loading">
        <template slot="sql_id" slot-scope="scope">
          <a class="a-link" @click="watchDetail(scope.data)">{{scope.data.sql_id}}</a>
        </template>
      </mh-table>
      <mh-table
        v-if="currSelectTable === 'sector'"
        :data-source="sectorDataSource"
        :loading="loading"
      ></mh-table>
      <mh-table
        v-if="currSelectTable === 'nobind'"
        :data-source="nobindDataSource"
        :loading="loading"
      ></mh-table>
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
      <sql-quote-detail :param="detailParam" v-if="showDetail" @close="showDetail = false;"></sql-quote-detail>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime, getService } from "@/views/utils/utils";
import SqlQuoteApi from "@/views/oracle/sql-quote/sqlQuoteApi";
import pagination from "@/views/components/pagination/Pagination";
import SqlQuoteDetail from '@/views/oracle/sql-quote/components/SqlQuoteDetail';
export default {
  name: "Sql-quote",
  mixins: [Mixins],
  components: {
    "mh-tabs": Tabs,
    pagination,
    "sql-quote-detail": SqlQuoteDetail
  },
  data() {
    let _this = this;
    return {
      name: "",
      pageIndex: 1,
      pageSize: 10,
      currSelectTab: "",
      total: 0,
      loading: false,
      tabs: [],
      currSelectTable: "quote",
      content: "说明: 每天采集1次,execs是sql在1天内的执行次数.",
      selectVal: "service",
      searchStr: "",
      detailParam: {},
      showDetail: false,
      conditionNameList: [
        {
          label: "实例名",
          value: "service"
        }
      ],
      tableTabs: [
        {
          label: "SQL全文索引",
          value: "quote"
        },
        {
          label: "SQL区段分析报表",
          value: "sector"
        },
        {
          label: "SQL未绑定变量报表",
          value: "nobind"
        }
      ],
      itemList: [],
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("sql_id", item),
            getHeaderContent: "sql_id",
            tooltip: true,
            type: "slot",
            slotName: "sql_id"
          },
          {
            getContent: item => _this.getField("sql_fulltext", item),
            getHeaderContent: "sql_fulltext",
            tooltip: true
          },
          {
            getContent: item => _this.getField("fsc", item),
            getHeaderContent: "fsc",
            tooltip: true
          },
          {
            getContent: item => _this.getField("exe", item),
            getHeaderContent: "exe",
            tooltip: true
          },
          {
            getContent: item => _this.getField("exec_per", item),
            getHeaderContent: "ex%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("buf", item),
            getHeaderContent: "buf",
            tooltip: true
          },
          {
            getContent: item => _this.getField("buff_per", item),
            getHeaderContent: "bu%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("disk", item),
            getHeaderContent: "dsk",
            tooltip: true
          },
          {
            getContent: item => _this.getField("disk_per", item),
            getHeaderContent: "di%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("ela", item),
            getHeaderContent: "ela",
            tooltip: true,
            sortable: true
          },
          {
            getContent: item => _this.getField("elap_per", item),
            getHeaderContent: "el%",
            tooltip: true,
            sortable: true
          },
          {
            getContent: item => _this.getField("cput_per", item),
            getHeaderContent: "cp%",
            tooltip: true,
            sortable: true
          },
          {
            getContent: item => _this.getField("parse_per", item),
            getHeaderContent: "pc%",
            tooltip: true,
            sortable: true
          },
          {
            getContent: item => _this.getField("sort_per", item),
            getHeaderContent: "so%",
            tooltip: true,
            sortable: true
          },
          {
            getContent: item => _this.getField("rows_processed", item),
            getHeaderContent: "row",
            tooltip: true,
            sortable: true
          },
          {
            getContent: item => _this.getField("app_name", item),
            getHeaderContent: "app",
            tooltip: true,
            sortable: true
          }
        ]
      },
      sectorItemList: [],
      sectorDataSource: {
        getItemList: () => _this.sectorItemList,
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
            getContent: item => _this.getField("service", item),
            getHeaderContent: "实例",
            tooltip: true
          },
          {
            getContent: item => _this.getField("total", item),
            getHeaderContent: "total",
            tooltip: true
          },
          {
            getContent: item => _this.getField("fscan", item),
            getHeaderContent: "fsc",
            tooltip: true
          },
          {
            getContent: item => _this.getField("execs", item),
            getHeaderContent: "exec",
            tooltip: true
          },
          {
            getContent: item => _this.getField("lgrds", item),
            getHeaderContent: "buff",
            tooltip: true
          },
          {
            getContent: item => _this.getField("phrds", item),
            getHeaderContent: "disk",
            tooltip: true
          },
          {
            getContent: item => _this.getField("rows", item),
            getHeaderContent: "rows",
            tooltip: true
          },
          {
            getContent: item => _this.getField("elapsed", item),
            getHeaderContent: "elap",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sorts", item),
            getHeaderContent: "sort",
            tooltip: true,
            sortable: true
          }
        ]
      },
      sqlBindList: [],
      nobindDataSource: {
        getItemList: () => _this.sqlBindList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "gmt_create",
            tooltip: true
          },
          {
            getContent: item => _this.getField("service", item),
            getHeaderContent: "service",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sql_text", item),
            getHeaderContent: "sql_text",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sql_cnt", item),
            getHeaderContent: "sql_cnt",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sql_delta", item),
            getHeaderContent: "sql_delta",
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
      _this.queryQuoteList();
    })
  },
  methods: {
     //查询service
    queryService() {
      let _this = this;   
     return  SqlQuoteApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0] && _this.tabs[0].value;
      })
    },
    toggleTab(tab) {
      let _this = this;
      if (_this.currSelectTab === tab.value) return;
      _this.currSelectTab = tab.value;
      _this.pageIndex = 1;
      _this[
        `query${_this.currSelectTable.charAt(0).toUpperCase() +
          _this.currSelectTable.slice("1")}List`
      ]();
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        starttime: formatDateTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "yyyy-MM:dd hh:mm:ss"
        ),
        endtime: formatDateTime(new Date(), "yyyy-MM-dd hh:mm:ss"),
        [_this.selectVal]: _this.searchStr.trim(),
        service: _this.currSelectTab
      };
    },
    toggleTableTab(tab) {
      let _this = this;
      if (_this.currSelectTable === tab.value) return;
      _this.currSelectTable = tab.value;
      _this.content =
        _this.currSelectTable === "quoto"
          ? "说明: 每天采集1次,execs是sql在1天内的执行次数. "
          : "说明: execs/lgrds/phrds(=0/<=1k/<=10k/>10k); cpu/elapsed/sorts(=0/<=1/<=10/>10)";
      _this[
        `query${_this.currSelectTable.charAt(0).toUpperCase() +
          _this.currSelectTable.slice("1")}List`
      ]();
    },
    queryQuoteList() {
      let _this = this;
      _this.loading = true;
      SqlQuoteApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "sqlQuote",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.sqlQuote;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    getConditionSector() {
      let _this = this;
      return {
        starttime: formatDateTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "yyyy-MM:dd hh:mm:ss"
        ),
        endtime: formatDateTime(new Date(), "yyyy-MM-dd hh:mm:ss"),
        [_this.selectVal]: _this.searchStr.trim(),
        service: _this.currSelectTab
      };
    },
    getNoSqlBindCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
         starttime: formatDateTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "yyyy-MM:dd hh:mm:ss"
        ),
        endtime: formatDateTime(new Date(), "yyyy-MM-dd hh:mm:ss"),
        service: _this.currSelectTab
      };
    },
    querySectorList() {
      let _this = this;
      _this.loading = true;
      SqlQuoteApi.querySummaryRpt(_this.getConditionSector()).then(resp => {
        _this
          .updateTableList({
            tableName: "sqlSummaryRpt",
            list: resp.data
          })
          .then(() => {
            _this.sectorItemList = _this.$store.state.db.sqlSummaryRpt;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    queryNobindList() {
      let _this = this;
      _this.loading = true;
      SqlQuoteApi.querySqlBind(_this.getNoSqlBindCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "sqlNoBind",
            list: resp.data
          })
          .then(() => {
            _this.sqlBindList = _this.$store.state.db.sqlNoBind;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    getField(field, item) {
      let _this = this,
        normalFields = [];
      if (_this.currSelectTable === "quote")
        normalFields = [
          "sql_fulltext",
          "fsc",
          "exe",
          "exec_per",
          "buf",
          "buff_per",
          "disk",
          "disk_per",
          "ela",
          "elap_per",
          "cput_per",
          "parse_per",
          "sort_per",
          "rows_processed",
          "app_name"
        ];
      if (_this.currSelectTable === "sector")
        normalFields = [
          "service",
          "total",
          "fscan",
          "execs",
          "lgrds",
          "phrds",
          "rows",
          "elapsed",
          "sorts",
          "cput_per",
          "parse_per",
          "sort_per"
        ];
      if (_this.currSelectTable === "nobind")
        normalFields = ["service", "sql_text", "sql_cnt", "sql_delta"];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.pageIndex = val;
      _this[
        `query${_this.currSelectTable.charAt(0).toUpperCase() +
          _this.currSelectTable.slice("1")}List`
      ]();
    },
    handleSizeChange(val) {
      let _this = this;
      _this.pageSize = val;
      _this.pageIndex = 1;
      _this[
        `query${_this.currSelectTable.charAt(0).toUpperCase() +
          _this.currSelectTable.slice("1")}List`
      ]();
    },
    search() {
      let _this = this;
      _this.pageIndex = 1;
      _this[
        `query${_this.currSelectTable.charAt(0).toUpperCase() +
          _this.currSelectTable.slice("1")}List`
      ]();
    },
    watchDetail(param) {
      let _this = this;
      _this.detailParam = param;
      _this.showDetail = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>