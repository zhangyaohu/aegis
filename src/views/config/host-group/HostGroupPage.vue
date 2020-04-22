<template>
  <page-template>
    <template slot="page-header">
      <span class="title">主机管理</span>
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
      <button class="btn-primary" style="margin-left: 10px;" @click="pageIndex = 1; queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="host_ids" slot-scope="scope">
          <a class="a-link" @click="watchHostList(scope.data)">查看主机列表</a>
        </template>
        <template slot="status" slot-scope="scope">
          <state :state="scope.data.status" :content="scope.data.status === 'open'  ? '开启' : '关闭'"></state>
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
      <host-list v-if="showHostList" :param="hostListParam" @close="showHostList = false;"></host-list>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import { formatDateTime } from "@/views/utils/utils";
import HostGroupApi from "@/views/config/host-group/hostGroupApi";
import HostList from '@/views/config/host-group/components/HostList';
export default {
  mixins: [Mixins],
  name: "HostManagerPage",
  components: {
    'host-list': HostList
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "list",
      pageIndex: 1,
      pageSize: 10,
      itemList: [],
      loading: false,
      selectVal: 'name',
      searchStr: '',
      total: 0,
      showHostList: false,
      hostListParam: {},
      sortDirection: '-',
      sortBy: 'gmt_create',
      conditionNameList: [
        {
          label: '群组名称',
          value: 'name'
        },
      ],
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("id", item),
            getHeaderContent: "编号",
            tooltip: true
          },
          {
            getContent: item => _this.getField("name", item),
            getHeaderContent: "群组名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("type", item),
            getHeaderContent: "类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("description", item),
            getHeaderContent: "群组描述",
            tooltip: true
          },
          {
            getHeaderContent: "包含的主机",
            tooltip: true,
            type: "slot",
            slotName: "host_ids"
          },
          {
            getContent: item => _this.getField("status", item),
            getHeaderContent: "监控状态",
            tooltip: true,
            type: "slot",
            slotName: "status"
          },
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "创建时间",
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
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = ["id", "name", "type", "description"];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
        sort: `${_this.sortDirection}${_this.sortBy}`
      };
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      HostGroupApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "hostGroup",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.hostGroup;
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
    },
         //排序
    handleSort(sort) {
      let _this = this;
      if(sort.order)
      _this.sortDirection = sort.order === 'descending' ? '-' : '+';
      _this.sortBy = sort.prop;
      _this.queryList()
    },
    //查看主机列表
    watchHostList(param) {
      let _this = this;
      _this.hostListParam = param;
      _this.showHostList = true;
    }
  }
};
</script>