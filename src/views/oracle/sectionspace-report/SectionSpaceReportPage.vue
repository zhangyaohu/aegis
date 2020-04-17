<template>
  <page-template>
    <template slot="page-header">
      <span class="title">索引访问报表</span>
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
      <button class="btn-primary" @click="queryList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="history" slot-scope="scope">
          <a class="a-link" @click="!scope.data.handle && handle()">查看历史</a>
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
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime, getService } from "@/views/utils/utils";
import SectionSpaceReportApi from "@/views/oracle/sectionspace-report/SectionSpaceReportApi";
export default {
  mixins: [Mixins],
  name: "SectionSpaceReportPage",
  components: {
    "mh-tabs": Tabs
  },
  data() {
    let _this = this;
    return {
      name: "",
      currSelectTab: "",
      pageIndex: 1,
      pageSize: 10,
      tabs: [],
      itemList: [],
      loading: false,
      total: 0,
      sortDirection: "-",
      sortBy: "gmt_create",
      selectVal: "segment_name",
      searchStr: "",
      conditionNameList: [
        {
          label: "段名",
          value: "segment_name"
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
            getContent: item => _this.getField("tablespace_name", item),
            getHeaderContent: "创建者",
            tooltip: true,
            sortable: true,
            field: "tablespace_name"
          },
          {
            getContent: item => _this.getField("segment_name", item),
            getHeaderContent: "段名",
            tooltip: true,
            sortable: true,
            field: "segment_name"
          },
          {
            getContent: item => _this.getField("partition_name", item),
            getHeaderContent: "分区名",
            tooltip: true,
            sortable: true,
            field: "partition_name"
          },
          {
            getContent: item => _this.getField("segment_type", item),
            getHeaderContent: "段类型",
            tooltip: true,
            sortable: true,
            field: "segment_type"
          },
          {
            getContent: item => _this.getField("used_space", item),
            getHeaderContent: "使用(MB)",
            tooltip: true,
            sortable: true,
            field: "used_space"
          },
          {
            getContent: item => _this.getField("diff_space", item),
            getHeaderContent: "增量(MB)",
            tooltip: true,
            sortable: true,
            field: "diff_space"
          },
          {
            getContent: item => _this.getField("last_ddl_time", item),
            getHeaderContent: "最后DDL时间",
            tooltip: true,
            sortable: true,
            field: "last_ddl_time"
          },
          {
            getHeaderContent: "历史数据",
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
      return SectionSpaceReportApi.queryList().then(resp => {
        _this.tabs = getService(resp.data);
        _this.currSelectTab = _this.tabs[0] && _this.tabs[0].value;
      });
    },
    //切换Tab页
    toggleTab(tab) {
      let _this = this;
      if (_this.currSelectTab === tab.value) return;
      _this.currSelectTab = tab.value;
      _this.queryList();
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        sort: `${_this.sortDirection}${_this.sortBy}`,
        service: _this.currSelectTab,
        [_this.selectVal]: _this.searchStr.trim()
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "tablespace_name",
          "used_space",
          "partition_name",
          "last_ddl_time",
          "diff_space",
          "segment_name",
          "segment_type"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    //查询表格数据
    queryList() {
      let _this = this;
      _this.loading = true;
      SectionSpaceReportApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "sectionSpaceReport",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.sectionSpaceReport;
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
    //排序
    handleSort(sort) {
      let _this = this;
      if (sort.order)
        _this.sortDirection = sort.order === "descending" ? "-" : "+";
      _this.sortBy = sort.prop;
      _this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>