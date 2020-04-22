<template>
  <mh-drawer :visiable="visiable" @close="$emit('close')">
    <template slot="header">
      <span class="mh-drawer__title">历史详情</span>
    </template>
    <template slot="body">
      <span class="mh-search" style="padding: 10px 0px;">
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
        <button class="btn-primary" @click="pageIndex = 1; historyQuery()">
          <i class="icon el-icon-search"></i>
          <span class="text">搜索</span>
        </button>
      </span>
      <mh-table :data-source="dataSource" :loading="loading"></mh-table>
      <div class="page-pagination">
        <pagination
          :total="total"
          v-show="total>0"
          :currentPage="pageIndex"
          @size-change="handleSizeChange"
          :pageSize="pageSize"
          @change="handleCurrentChange"
        ></pagination>
      </div>
    </template>
  </mh-drawer>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import { formatDateTime, sizeRound, toFixed2 } from "@/views/utils/utils";
import Drawer from "@/views/components/Drawer/Drawer";
import RecordChangeApi from "@/views/oracle/record-change/recordChangeApi";
export default {
  name: "QuoteReportHistoryPage",
  mixins: [Mixins],
  components: {
    "mh-drawer": Drawer
  },
  props: {
    param: {
      type: Object,
      default: () => {}
    },
    visiable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let _this = this;
    return {
      pageIndex: 1,
      pageSize: 10,
      sortBy: "gmt_create",
      sortDirection: "-",
      loading: false,
      total: 0,
      itemList: [],
      selectVal: "owner",
      searchStr: "",
      conditionNameList: [
        {
          label: "所有者",
          value: "owner"
        }
      ],
      dataSource: {
        getItemList: () => _this.itemList,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "更新时间",
            tooltip: true
          },
          {
            getContent: item => _this.getField("owner", item),
            getHeaderContent: "创建者",
            tooltip: true
          },
          {
            getContent: item => _this.getField("table_name", item),
            getHeaderContent: "表名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("ins_diff", item),
            getHeaderContent: "新增数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("total_dmls", item),
            getHeaderContent: "新增%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("upd_diff", item),
            getHeaderContent: "更新数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("upd_rate", item),
            getHeaderContent: "更新%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("del_diff", item),
            getHeaderContent: "删除数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("del_rate", item),
            getHeaderContent: "删除%",
            tooltip: true
          },
          {
            getContent: item => _this.getField("dml_diff", item),
            getHeaderContent: "DML数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("num_rows", item),
            getHeaderContent: "总行数",
            tooltip: true
          },
          {
            getContent: item => _this.getField("truncated", item),
            getHeaderContent: "trunc",
            tooltip: true
          }
        ]
      }
    };
  },
  mounted() {
    let _this = this;
    _this.historyQuery();
  },
  methods: {
    //查询条件
    getCondition() {
      let _this = this;
      return {
        [_this.selectVal]: _this.searchStr.trim(),
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        starttime: formatDateTime(
          new Date(_this.param.gmt_create).getTime() - 30 * 24 * 60 * 60 * 1000,
          "yyyy-MM-dd hh:mm:ss"
        ),
        endtime: formatDateTime(
          new Date(_this.param.gmt_create).getTime(),
          "yyyy-MM-dd hh:mm:ss"
        ),
        table_name: _this.param.table_name
      };
    },
    historyQuery() {
      let _this = this;
      _this.loading = true;
      RecordChangeApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "recordChangeHistory",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.recordChangeHistory;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = ["owner", "table_name", "truncated"];
      if (normalFields.includes(field)) return item[field];
      let normalSizeFields = [
        "num_rows",
        "dml_diff",
        "ins_diff",
        "upd_diff",
        "del_diff"
      ];
      if (normalSizeFields.includes(field)) return sizeRound(item[field]);
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
      if (field === "total_dmls")
        return item["dml_diff"] === 0
          ? 0
          : toFixed2(item["ins_diff"] / item["dml_diff"], 2);
      if (field === "upd_rate")
        return item["dml_diff"] === 0
          ? 0
          : toFixed2(item["upd_diff"] / item["dml_diff"], 2);
      if (field === "del_rate")
        return item["del_diff"] === 0
          ? 0
          : toFixed2(item["del_diff"] / item["dml_diff"], 2);
    },
    //改变每页条数
    handleSizeChange(size) {
      let _this = this;
      if (size === _this.pageSize) return;
      _this.pageSize = size;
      _this.pageIndex = 1;
      _this.historyQuery();
    },
    //改变当前页数
    handleCurrentChange(pageIndex) {
      let _this = this;
      if (pageIndex === _this.pageIndex) return;
      _this.pageIndex = pageIndex;
      _this.historyQuery();
    },
    //排序
    handleSort(sort) {
      let _this = this;
      _this.sortDirection = sort.order === "ascending" ? "+" : "-";
      _this.sortBy = sort.prop;
      _this.historyQuery();
    }
  }
};
</script>