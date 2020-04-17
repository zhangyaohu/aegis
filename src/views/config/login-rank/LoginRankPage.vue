<template>
  <page-template>
    <template slot="page-header">
      登录排行
    </template>
    <template slot="page-toolbar">
      <div class="mh-timePicker">
        <label name="timeRange" class="mh-input__label">请选择日期范围:</label>
        <el-date-picker
          v-model="timeRange"
          style="border-radius: 0px 3px 3px 0px;"
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
      <mh-table :data-source="dataSource" :loading="loading"></mh-table>
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
import { formatDateTime } from "@/views/utils/utils";
import LoginRankApi from "@/views/config/login-rank/loginRankApi";
export default {
  mixins: [Mixins],
  components: {
    "mh-tabs": Tabs
  },
  data() {
    let _this = this;
    return {
      name: "",
      timeRange: [new Date(new Date().getTime() - 604800000), new Date()],
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      itemList: [],
      total: 0,
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("user_name", item),
            getHeaderContent: "用户名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("cnt", item),
            getHeaderContent: "登录数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("last_time", item),
            getHeaderContent: "最后登录时间",
            tooltip: true
          }
        ]
      },
    };
  },
  mounted() {
    let _this = this;
    _this.queryList();
  },
  methods: {
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        starttime: _this.timeRange[0],
        endtime: _this.timeRange[1]
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "user_name",
          "cnt"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "last_time")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      LoginRankApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "rank",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.rank;
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