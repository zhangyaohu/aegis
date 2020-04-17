<template>
  <page-template>
    <template slot="page-header">
      <span class="title">活动会话历史</span>
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
          placeholder="请输入段名(表名|索引名)"
          v-model="searchStr"
          class="mh-inline"
          inputClass="mh-input__search"
          style="padding: 0px 10px 0px 0px;"
        />
      </span>
      <button class="btn-primary" @click="queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
      <button class="btn-primary" style="margin:0px 10px;" @click="downLoadTable()">
        <i class="icon el-icon-download"></i>
        <span class="text">导出报表</span>
      </button>
      <helper-trigger content="说明: 每五分钟更新" />
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="object_name" slot-scope="scope">
          <a class="a-link" @click="watchSessionObj(scope.data)">{{scope.data.object_name}}</a>
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
       <session-object-page v-if="showSessionObj" :param="objParam" @close="showSessionObj = false;"></session-object-page>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime, exportTableData, getService } from "@/views/utils/utils";
import SessionHistoryHttpApi from "@/views/oracle/session-history/sessionHistoryApi";
import SessionObjectPage from '@/views/oracle/session-history/components/SessionObjectPage';
export default {
  mixins: [Mixins],
  name: "SessionHistoryPage",
  components: {
    "mh-tabs": Tabs,
    "session-object-page": SessionObjectPage
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "maxdata1",
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      total: 0,
      selectVal: 'owner',
      searchStr: '',
      tabs: [],
      showSessionObj: false,
       conditionNameList: [
        {
          label: "所有者",
          value: "owner"
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
            getContent: item => _this.getField("owner", item),
            getHeaderContent: "所有者",
            tooltip: true
          },
          {
            getHeaderContent: "对象名称",
            tooltip: true,
            type: 'slot',
            slotName: 'object_name'
          },
          {
            getContent: item => _this.getField("object_type", item),
            getHeaderContent: "对象类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("wait_class", item),
            getHeaderContent: "等待分类",
            tooltip: true
          },
          {
            getContent: item => _this.getField("event", item),
            getHeaderContent: "事件名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("total_waits", item),
            getHeaderContent: "总等待次数",
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
        service: _this.currSelectTab
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "owner",
          "object_type",
          "wait_class",
          "total_waits",
          "event"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "date")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    queryService() {
      let _this = this;
     return SessionHistoryHttpApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0].value;
      })
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      SessionHistoryHttpApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "sessionHistory",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.sessionHistory;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    downLoadTable() {
      let _this = this,
        str = "";
      str = `所有者,对象名称,对象类型,等待分类,事件名称,总等待次数\n`;
      _this.itemList.forEach((it, index) => {
        str += `${it.owner},${it.object_name},${it.object_type},${it.wait_class},${it.event},${it.total_waits}\n`;
      });
      exportTableData(`${_this.currSelectTab}.csv`, str);
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
    },
    //查看对象名称
    watchSessionObj(param){
      let _this = this;
      _this.objParam = param;
      _this.showSessionObj = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>