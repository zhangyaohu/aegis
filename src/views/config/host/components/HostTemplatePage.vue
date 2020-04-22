<template>
  <div>
    <div class="page-template__toolbar">
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
    </div>
    <div class="page-template__table">
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
    </div>
  </div>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import { formatDateTime } from '@/views/utils/utils';
import HostManagerApi from "@/views/config/host/hostManagerApi";
export default {
  name: "TempaltePage",
  mixins: [Mixins],
  props: {
    param: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let _this = this;
    return {
      selectVal: "name",
      searchStr: "",
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      conditionNameList: [
        {
          label: "名称",
          value: "name"
        }
      ],
      itemList: [],
      total: 0,
      sortDirection: "-",
      sortBy: "gmt_create",
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("host_name", item),
            getHeaderContent: "主机名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("name", item),
            getHeaderContent: "名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sname", item),
            getHeaderContent: "简称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("type", item),
            getHeaderContent: "类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("sortby", item),
            getHeaderContent: "排序",
            tooltip: true
          },
          {
            getContent: item => _this.getField("currval", item),
            getHeaderContent: "currval",
            tooltip: true
          },
          {
            getContent: item => _this.getField("lastval", item),
            getHeaderContent: "lastval",
            tooltip: true
          },
          {
            getContent: item => _this.getField("superby", item),
            getHeaderContent: "super",
            tooltip: true
          },
          {
            getContent: item => _this.getField("times", item),
            getHeaderContent: "times",
            tooltip: true
          },
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "创建时间",
            tooltip: true,
            sortable: true,
            field: "gmt_create"
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
    //查询条件
    getCondition() {
      let _this = this;
      return {
        [_this.selectVal]: _this.searchStr.trim(),
        host_name: _this.param.name,
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        sortBy: `${_this.sortDirection}${_this.sortBy}`
      };
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      HostManagerApi.queryTemplate(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "hostTemplate",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.hostTemplate;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    //填充表格数据
    getField(field, item) {
      let _this = this, normalFields = ['name', 'host_name', 'sname', 'type', 'sortby', 'superby', 'currval', 'lastval', 'times'];
      if(normalFields.includes(field)) return item[field];
      if(field === 'gmt_create')
      return formatDateTime(item[field], 'yyyy-MM-dd hh:mm:ss');
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
     //改变每页条数
    handleSizeChange(size) {
      let _this = this;
      if (size === _this.pageSize) return;
      _this.pageSize = size;
      _this.pageIndex = 1;
      _this.queryList();
    },
  }
};
</script>