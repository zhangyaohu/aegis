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
        <button class="btn-primary" @click="historyQuery()">
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
import { formatDateTime } from "@/views/utils/utils";
import Drawer from "@/views/components/Drawer/Drawer";
import QuoteReportApi from "@/views/oracle/quote-report/quoteReportApi";
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
      conditionNameList: [{
				label: '所有者',
				value: 'owner'
			}],
      dataSource: {
				getItemList: () => _this.itemList,
				handleSort: _this.handleSort,
        fields: [
          {
            getHeaderContent: "更新时间",
            getContent: item => _this.getField("gmt_create", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "创建者",
            getContent: item => _this.getField("owner", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "表名",
            getContent: item => _this.getField("table_name", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "存储(MB)",
            getContent: item => _this.getField("total_size", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "SQL总数",
            getContent: item => _this.getField("sql_total", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "索引总数",
            getContent: item => _this.getField("ind_total", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "冗余数",
            getContent: item => _this.getField("redu_total", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "使用数",
            getContent: item => _this.getField("ind_used", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "未使用数",
            getContent: item => _this.getField("ind_unused", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "最大列",
            getContent: item => _this.getField("col_max", item),
            sortable: true,
            tooltip: true
          },
          {
            getHeaderContent: "平均列",
            getContent: item => _this.getField("col_avg", item),
            sortable: true,
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
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
          "yyyy-MM-dd hh:mm:ss"
        ),
				endtime: formatDateTime(new Date().getTime(), "yyyy-MM-dd hh:mm:ss"),
				table_name: _this.param.table_name
      };
    },
    historyQuery() {
      let _this = this;
      QuoteReportApi.queryList(_this.getCondition()).then((resp) => {
        _this
          .updateTableList({
            tableName: "quoteReportHistory",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.quoteReportHistory;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
		},
		//填充数据
		getField(field, item){
			let _this = this, normalFields = ['owner', 'total_size', 'ind_total', 'ind_unused', 'ind_used', 'col_avg', 'col_max', 'sql_total', 'table_name', 'redu_total'];
			if(normalFields.includes(field)) return item[field];
			if(field === 'gmt_create') return formatDateTime(item[field], 'yyyy-MM-dd hh:mm:ss');
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
      _this.sortDirection = sort.order ===  'ascending' ? '+' : '-';
      _this.sortBy = sort.prop;
      _this.historyQuery();
    },
  }
};
</script>