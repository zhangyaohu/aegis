<template>
  <page-template>
    <template slot="page-header">
      <span class="title">模板管理</span>
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
      <button class="btn-primary" style="margin-left: 10px;" @click="queryList()">
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
import { formatDateTime } from "@/views/utils/utils";
import ExceptManagerApi from "@/views/config/except-manager/exceptManagerApi";
export default {
  mixins: [Mixins],
  name: "ExceptManagerPage",
  data() {
    let _this = this;
    return {
      name: "",
      pageIndex: 1,
      pageSize: 10,
      itemList: [],
      loading: false,
      sortDirection: '-',
      sortBy: 'gmt_create',
      total: 0,
      selectVal: 'err_code',
      searchStr: '',
      conditionNameList: [
        {
          label: '异常代码',
          value: 'err_code'
        }
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
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "创建时间",
            tooltip: true,
            sortable: true,
            field: 'gmt_create',
          },
          {
            getContent: item => _this.getField("err_code", item),
            getHeaderContent: "异常代码",
            tooltip: true
          },
          {
            getContent: item => _this.getField("err_type", item),
            getHeaderContent: "角色类型",
            tooltip: true
          },
          {
						getContent: item => _this.getField("message", item),
            getHeaderContent: "异常信息",
            tooltip: true
          },
          {
						getContent: item => _this.getField("gmt_modified", item),
            getHeaderContent: "最后访问时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("times", item),
            getHeaderContent: "计数",
            tooltip: true,
          },
          {
            getContent: item => _this.getField("operate", item),
            getHeaderContent: "操作",
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
        normalFields = ["id", 'times',"err_type", "message", "err_code", "operate"];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create" || field === 'gmt_modified')
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
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
    queryList() {
      let _this = this;
      _this.loading = true;
      ExceptManagerApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "exceptManager",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.exceptManager;
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
    }
  }
};
</script>

<style lang="less" scoped>
</style>