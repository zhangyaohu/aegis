<template>
  <page-template>
    <template slot="page-header">
      <mh-tabs @tab-click="toggleTab" :tabs="tabs" v-model="currSelectTab"></mh-tabs>
    </template>
    <template slot="page-toolbar">
      <mh-input
        placeholder="请输入查询信息"
        v-model="name"
        label="请输入查询信息"
        class="mh-inline"
        style="padding-bottom: 0"
      />
      <div class="mh-timePicker">
        <label name="timeRange" class="mh-input__label">请选择日期范围:</label>
        <el-date-picker style="border-radius: 0 3px 3px 0px;"
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
      <mh-table v-if="currSelectTab === 'alert'" :data-source="dataSource" :loading="loading">
        <template slot="handle" slot-scope="scope">
          <State
            :state="scope.data.handle ? 'handle' : 'no_handle'"
            :content="scope.data.handle ? '已处理' : '待处理'"
            @handle="!scope.data.handle && handle()"
          ></State>
        </template>
      </mh-table>
      <mh-table v-if="currSelectTab === 'aserv'" :data-source="aservDataSource"></mh-table>
      <mh-table v-if="currSelectTab === 'atype'" :data-source="atypeDataSource"></mh-table>
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
import AlarmHttpApi from "@/views/alarm/alarm/alarmHttpApi";
export default {
  mixins: [Mixins],
  components: {
    "mh-tabs": Tabs
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "alert",
      timeRange: [new Date(new Date().getTime() - 604800000), new Date()],
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      sortDirection: '-',
      sortBy: 'gmt_create',
      total: 0,
      tabs: [
        {
          label: "告警明细",
          value: "alert"
        },
        {
          label: "按实例统计",
          value: "aserv"
        },
        {
          label: "按告警类型统计",
          value: "atype"
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
            getContent: item => _this.getField("date", item),
            getHeaderContent: "告警时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("hostname", item),
            getHeaderContent: "主机名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("servername", item),
            getHeaderContent: "服务名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("info", item),
            getHeaderContent: "告警信息",
            tooltip: true
          },
          {
            getContent: item => _this.getField("type", item),
            getHeaderContent: "类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("subtype", item),
            getHeaderContent: "子类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("level", item),
            getHeaderContent: "级别",
            tooltip: true
          },
          {
            getContent: item => _this.getField("role", item),
            getHeaderContent: "角色组",
            tooltip: true
          },
          {
            getContent: item => _this.getField("handle", item),
            getHeaderContent: "负责人",
            tooltip: true,
            type: "slot",
            slotName: "handle"
          }
        ]
      },
      aservDataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("date", item),
            getHeaderContent: "最早告警时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("hostname", item),
            getHeaderContent: "实例",
            tooltip: true
          },
          {
            getContent: item => _this.getField("servername", item),
            getHeaderContent: "告警总数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("info", item),
            getHeaderContent: "最近告警时间",
            tooltip: true
          }
        ]
      },
      atypeDataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("date", item),
            getHeaderContent: "最早告警时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("date", item),
            getHeaderContent: "主机名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("hostname", item),
            getHeaderContent: "实例",
            tooltip: true
          },
          {
            getContent: item => _this.getField("hostname", item),
            getHeaderContent: "类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("hostname", item),
            getHeaderContent: "子类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("servername", item),
            getHeaderContent: "告警项目",
            tooltip: true
          },
          {
            getContent: item => _this.getField("servername", item),
            getHeaderContent: "告警次数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("info", item),
            getHeaderContent: "最近告警时间",
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
        sort: `${_this.sortDirection}${_this.sortBy}`,
        starttime: _this.timeRange[0],
        endtime: _this.timeRange[1],
        sname: '',
        hostname: ''
      }
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "hostname",
          "servername",
          "info",
          "type",
          "subtype",
          "level",
          "role",
          "handle"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "date")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      AlarmHttpApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "alarm",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.alarm;
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