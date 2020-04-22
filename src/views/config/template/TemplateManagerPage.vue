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
      <button class="btn-primary" style="margin-left: 10px;" @click="pageIndex = 1; queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="user_g" slot-scope="scope">
          <a class="a-link" v-if="scope.data.super !== 1">查看用户列表</a>
        </template>
        <template slot="host_g" slot-scope="scope">
          <a class="a-link">查看主机群组</a>
        </template>
        <template slot="type" slot-scope="scope">
          <state :state="scope.data.type" :content="scope.data.type"></state>
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
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import { formatDateTime } from "@/views/utils/utils";
import TemplateManagerApi from "@/views/config/template/templateMangerApi";
export default {
  mixins: [Mixins],
  name: "TemplateManagerPage",
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "list",
      pageIndex: 1,
      pageSize: 10,
      tabs: [
        {
          label: "用户列表",
          value: "list"
        },
        {
          label: "查看所属角色",
          value: "role"
        }
      ],
      itemList: [],
      loading: false,
      total: 0,
      selectVal: 'name',
      searchStr: '',
      sortDirection: '-',
      sortBy: 'gmt_create',
      conditionNameList: [
        {
          label: '名称',
          value: 'name'
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
            getHeaderContent: "创建",
            tooltip: true,
            sortable: true,
            field: 'gmt_create'
          },
          {
            getContent: item => _this.getField("name", item),
            getHeaderContent: "名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sname", item),
            getHeaderContent: "简介",
            tooltip: true
          },
          {
            getContent: item => _this.getField("kind", item),
            getHeaderContent: "类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("type", item),
            getHeaderContent: "来源",
            tooltip: true
          },
          {
            getContent: item => _this.getField("tags", item),
            getHeaderContent: "标签",
            tooltip: true
          },
          {
            getContent: item => _this.getField("level", item),
            getHeaderContent: "级别",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sortby", item),
            getHeaderContent: "排序",
            tooltip: true
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
        normalFields = [
          "id",
          "sname",
          "type",
          "name",
          "kind",
          "operate",
          "tags",
          "level",
          "sortby"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
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
      TemplateManagerApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "templateManager",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.templateManager;
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