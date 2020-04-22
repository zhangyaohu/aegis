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
        <template slot="link" slot-scope="scope">
          <a class="a-link" @click="linkToRelation(scope.data, 'host-template')">模板</a>
          |
          <a class="a-link" @click="linkToRelation(scope.data, 'metric')">趋势图</a>
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
      <host-manager-relation-page v-if="showRelation" :param="relationParam" @close="showRelation = false;"></host-manager-relation-page>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import { formatDateTime } from "@/views/utils/utils";
import HostManagerApi from "@/views/config/host/hostManagerApi";
import HostManagerRelationPage from '@/views/config/host/components/HostManagerRelationPage';
export default {
  mixins: [Mixins],
  name: "HostManagerPage",
  components: {
    'host-manager-relation-page': HostManagerRelationPage
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
      total: 0,
      selectVal: 'name',
      searchStr: '',
      sortDirection: '-',
      sortBy: 'gmt_create',
      showRelation: false,
      conditionNameList: [
        {
          label: '主机名',
          value: 'name'
        },
        {
          label: '实例名',
          value: 'db_name'
        }
      ],
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("name", item),
            getHeaderContent: "名称",
            tooltip: true
          },
          {
            getHeaderContent: "链接",
            tooltip: true,
            type: "slot",
            slotName: "link"
          },
          {
            getContent: item => _this.getField("os_type", item),
            getHeaderContent: "操作系统",
            tooltip: true
          },
          {
            getContent: item => _this.getField("ip_addr", item),
            getHeaderContent: "IP地址",
            tooltip: true
          },
          {
            getContent: item => _this.getField("db_type", item),
            getHeaderContent: "DB类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("db_name", item),
            getHeaderContent: "DB名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("db_role", item),
            getHeaderContent: "DB角色",
            tooltip: true
          },
          {
            getContent: item => _this.getField("up_load", item),
            getHeaderContent: "负载",
            tooltip: true
          },
          {
            getContent: item => _this.getField("up_days", item),
            getHeaderContent: "运行天数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("operate", item),
            getHeaderContent: "操作",
            tooltip: true
          },
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "检查时间",
            tooltip: true,
            sortable: true,
            field: 'gmt_create'
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
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
        sort: `${_this.sortDirection}${_this.sortBy}`
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "id",
          "name",
          "db_name",
          "db_type",
          "db_role",
          "os_type",
          "operate",
          "ip_addr",
          "up_days",
          "up_load"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      HostManagerApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "hostManager",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.hostManager;
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
    //跳转至相关页面
    linkToRelation(param, operate) {
      let _this = this;
      _this.relationParam = {}
      _this.relationParam = {...param, operate};
      _this.showRelation = true;
    }
  }
};
</script>