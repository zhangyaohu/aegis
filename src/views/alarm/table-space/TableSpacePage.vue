<template>
  <page-template>
    <template slot="page-header">表空间预警</template>
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
          placeholder="请输入查询信息"
          v-model="searchStr"
          class="mh-inline"
          inputClass="mh-input__search"
          style="padding: 0px 10px 0px 0px;"
        />
      </span>
      <button class="btn-primary" @click="search">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="history" slot-scope="scope" v-if="total>0">
          <a class="a-link" @click="handleWatchHistroy(scope.data)">查看历史</a>
        </template>
      </mh-table>
      <div class="page-pagination">
        <pagination
          :total="total"
          v-show="total>0"
          :currentPage="pageIndex"
          @size-change="handleSizeChange"
          :pageSize="pageSize"
          @change="handleCurrentChange"
        ></pagination>
      </div>
    </template>
    <template slot="page-footer">
      <mh-drawer :visiable="showDrawer"  @close="showDrawer = false">
        <template slot="header">
          <span class="mh-drawer__title">历史详情</span>
        </template>
        <template slot="body">
          <mh-input
            placeholder="请输入用户名"
            v-model="name"
            label="请输入用户名称"
            style="padding: 0px 10px 10px 0px"
            class="mh-inline"
          />
          <button class="btn-primary">
            <i class="icon el-icon-search"></i>
            <span class="text">搜索</span>
          </button>
          <mh-table :data-source="historyDataSource" :loading="historyLoading"></mh-table>
          <div class="page-pagination">
            <pagination
              :total="historyTotal"
              v-show="historyTotal>0"
              :currentPage="pageHistoryIndex"
              @size-change="handleHistorySizeChange"
              :pageSize="pageHistorySize"
              @change="handleHistoryCurrentChange"
            ></pagination>
          </div>
        </template>
      </mh-drawer>
    </template>
  </page-template>
</template>

<script>
import TableSpaceApi from "@/views/alarm/table-space/tableSpaceApi";
import { formatDateTime } from "@/views/utils/utils";
import Drawer from "@/views/components/Drawer/Drawer";
import Mixins from "@/mixins/Mixins";
export default {
  name: "TableSpacePage",
  mixins: [Mixins],
  components: {
    "mh-drawer": Drawer
  },
  data() {
    let _this = this;
    return {
      name: "",
      showDrawer: false,
      historyParam: {},
      itemList: [],
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      total: 0,
      selectVal: "tablespace",
      searchStr: "",
      sortDirection:'-',
      sortBy: 'gmt_create',
      pageHistoryIndex: 1,
      pageHistorySize: 10,
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
            field: "tablespace"
          },
          {
            getContent: item => _this.getField("total_space", item),
            getHeaderContent: "存储总数(MB)",
            tooltip: true,
            sortable: true,
            field: "total_space"
          },
          {
            getContent: item => _this.getField("used_space", item),
            getHeaderContent: "使用(MB)",
            tooltip: true,
            sortable: true,
            field: "used_space"
          },
          {
            getContent: item => _this.getField("free_space", item),
            getHeaderContent: "空闲(MB)",
            tooltip: true,
            sortable: true,
            field: "free_space"
          },
          {
            getContent: item => _this.getField("diff_space", item),
            getHeaderContent: "增量(MB)",
            tooltip: true,
            sortable: true,
            field: "diff_space"
          },
          {
            getContent: item => _this.getField("avg_space", item),
            getHeaderContent: "均值(MB)",
            tooltip: true,
            sortable: true,
            field: "avg_space"
          },
          {
            getContent: item => _this.getField("used_rate", item),
            getHeaderContent: "使用率(%)",
            tooltip: true,
            sortable: true,
            field: "used_rate"
          },
          {
            getContent: item => _this.getField("used_days", item),
            getHeaderContent: "可用天数",
            tooltip: true,
            sortable: true,
            field: "used_days"
          },
          {
            getHeaderContent: "历史数据",
            type: "slot",
            tooltip: true,
            slotName: "history"
          }
        ]
      },
      historyTotal: 0,
      historyItemList: [],
      historyLoading: false,
      historyDataSource: {
        getItemList: () => _this.historyItemList,
        type: "",
        fields: [
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "更新时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("tablespace", item),
            getHeaderContent: "表空间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("total_space", item),
            getHeaderContent: "存储总数(MB)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("used_space", item),
            getHeaderContent: "使用(MB)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("free_space", item),
            getHeaderContent: "空闲(MB)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("diff_space", item),
            getHeaderContent: "增量(MB)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("avg_space", item),
            getHeaderContent: "均值(MB)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("grow_fact", item),
            getHeaderContent: "增长系数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("used_rate", item),
            getHeaderContent: "使用率(%)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("used_days", item),
            getHeaderContent: "可用天数",
            tooltip: true
          }
        ]
      }
    };
  },
  mounted() {
    let _this = this;
    _this.queryList();
  },
  methods: {
    toggleTab(tab) {
      let _this = this;
      _this.currSelectTab = tab.value;
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr,
        sort: `${_this.sortDirection}${_this.sortBy}`
      };
    },
    //查询列表
    queryList() {
      let _this = this;
      _this.loading = true;
      TableSpaceApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "tableSpace",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.tableSpace;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    //填充表数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "tablespace",
          "used_days",
          "used_space",
          "used_rate",
          "diff_space",
          "avg_space",
          "free_space",
          "total_space"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    //获得查询历史条件
    getHistoryCondition(param) {
      let _this = this;
      return {
        tablespace:param.tablespace,
        starttime: formatDateTime(
          new Date(
            new Date(param.gmt_create).getTime() - 30 * 24 * 60 * 60 * 1000
          ),
          "yyyy-MM-dd hh:mm:ss"
        ),
        endtime: formatDateTime(param.gmt_create, "yyyy-MM-dd hh:mm:ss"),
        limit: _this.pageHisotrySize,
        start: ( _this.pageHistoryIndex - 1 ) * _this.pageHisotrySize
      };
    },
    //查看历史回调
    handleWatchHistroy(param) {
      let _this = this;
      if(param)
      _this.historyParam = param;
      TableSpaceApi.queryList(_this.getHistoryCondition(_this.historyParam)).then(resp => {
        _this
          .updateTableList({
            tableName: "tableHistory",
            list: resp.data
          })
          .then(() => {
            _this.historyItemList = _this.$store.state.db.tableHistory;
            _this.historyTotal = resp.total;
            _this.historyLoading = false;
          })
          .catch(() => {
            _this.historyLoading = false;
          });
      });
      _this.showDrawer = true;
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
    //搜索表格
    search() {
      let _this = this;
      _this.queryList();
    },
    //排序
    handleSort(sort) {
      let _this = this;
      if(!sort.order) return;
      _this.sortDirection = sort.order = 'descending' ? '-' : '+';
      _this.sortBy = sort.prop;
      _this.queryList();
    },
    //改变历史数据每页条数
    handleHistorySizeChange(size) {
      let _this = this;
      if (size === _this.pageHistorySize) return;
      _this.pageHistorySize = size;
      _this.pageHistoryIndex = 1;
      _this.handleWatchHistroy();
    },
    //改变当前页数
    handleHistoryCurrentChange(pageIndex) {
      let _this = this;
      if (pageIndex === _this.pageHistoryIndex) return;
      _this.pageHistoryIndex = pageIndex;
      _this.handleWatchHistroy();
    },
  }
};
</script>

