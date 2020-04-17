<template>
  <page-template>
    <template slot="page-header">
      <span class="title">数据字典报表</span>
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
      <helper-trigger content="说明: 此处查询可以全模糊匹配,比如要查cps项目所有的表,输入cps即可" />
    </template>
    <template slot="page-table">
      <mh-table :data-source="dataSource" :loading="loading">
        <template slot="column_info" slot-scope="scope">
          <a class="a-link" @click="!scope.data.handle && handle()">点击查看</a>
        </template>
        <template slot="index_info" slot-scope="scope">
          <a class="a-link" @click="!scope.data.handle && handle()">点击查看</a>
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
import DataDictionaryApi from "@/views/oracle/data-dictionary/DataDictionaryApi";
export default {
  name: "DataDictionaryPage",
  mixins: [Mixins],
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
      loading: false,
      tabs: [],
      itemList: [],
      total: 0,
      selectVal: "table_name",
      searchStr: "",
      conditionNameList: [
        {
          label: "表名",
          value: "table_name"
        }
      ],
      dataSource: {
        getItemList: () => _this.itemList,
        type: "",
        handleSelection: _this.handleSelect,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("OWNER", item),
            getHeaderContent: "创建者",
            tooltip: true
          },
          {
            getContent: item => _this.getField("TABLE_NAME", item),
            getHeaderContent: "表名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("NUM_ROWS", item),
            getHeaderContent: "行数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("BLOCKS", item),
            getHeaderContent: "块数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("LAST_ANALYZED", item),
            getHeaderContent: "分析时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("COMMIT", item),
            getHeaderContent: "注释",
            tooltip: true
          },
          {
            getHeaderContent: "列信息",
            tooltip: true,
            type: "slot",
            slotName: "column_info"
          },
          {
            getHeaderContent: "索引信息",
            tooltip: true,
            type: "slot",
            slotName: "index_info"
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
      return DataDictionaryApi.queryList().then(resp => {
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
        service: _this.currSelectTab,
        [_this.selectVal]: _this.searchStr.trim()
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [
          "OWNER",
          "TABLE_NAME",
          "STATUS",
          "COMMIT",
          "NUM_ROWS",
          "BLOCKS"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "LAST_ANALYZED")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    //查询表格数据
    queryList() {
      let _this = this;
      _this.loading = true;
      DataDictionaryApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "dataDictionary",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.dataDictionary;
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
    }
  }
};
</script>

<style lang="less" scoped>
</style>