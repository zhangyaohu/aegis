<template>
  <page-template>
    <template slot="page-header">
      <span class="title">序列监控报表</span>
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
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="history" slot-scope="scope">
          <a class="a-link" @click="watchHistroy(scope.data)">查看历史</a>
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
      <order-report-history v-if="showHistory" :visiable="showHistory" :param="historyParam" @close="showHistory = false;"></order-report-history>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime, getService } from "@/views/utils/utils";
import OrderReportApi from "@/views/oracle/order-report/orderReportApi";
import OrderReportHistoryPage from '@/views/oracle/order-report/components/OrderReportHistoryPage';
export default {
  mixins: [Mixins],
  name: "OrderReportPage",
  components: {
    "mh-tabs": Tabs,
    "order-report-history": OrderReportHistoryPage
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
      selectVal: "owner",
      searchStr: "",
      showHistory: false, 
      historyParam: {},
      conditionNameList: [
        {
          label: "所有者",
          value: "owner"
        },

        {
          label: "序列名",
          value: "sequence"
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
            getContent: item => _this.getField("owner", item),
            getHeaderContent: "所有者",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sequence", item),
            getHeaderContent: "序列名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("min_value", item),
            getHeaderContent: "最小值",
            tooltip: true
          },
          {
            getContent: item => _this.getField("max_value", item),
            getHeaderContent: "递增数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("last_number", item),
            getHeaderContent: "最后序列号",
            tooltip: true
          },
          {
            getContent: item => _this.getField("incr_by", item),
            getHeaderContent: "每天增量",
            tooltip: true
          },
          {
            getContent: item => _this.getField("cache_size", item),
            getHeaderContent: "缓存数",
            tooltip: true
          },
          {
            getHeaderContent: "历史",
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
      return OrderReportApi.queryList().then(resp => {
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
        service: _this.currSelectTab,
        [_this.selectVal]: _this.searchStr.trim()
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "owner",
          "sequence",
          "min_value",
          "max_value",
          "cache_size",
          "last_number",
          "incr_by"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    //查询表格数据
    queryList() {
      let _this = this;
      _this.loading = true;
      OrderReportApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "orderReport",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.orderReport;
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
    //查看历史
    watchHistroy(param) {
      let _this = this;
      _this.historyParam = param;
      _this.showHistory = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>