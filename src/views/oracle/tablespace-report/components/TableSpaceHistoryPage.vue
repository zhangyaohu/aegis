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
import TableSpaceReportApi from "@/views/oracle/tablespace-report/tableSpaceReportApi";
export default {
  name: "TableSpaceHistoryPage",
  mixins: [Mixins],
  props: {
    param: {
      type: Object,
      default: {}
    },
    visiable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    "mh-drawer": Drawer
  },
  data() {
    let _this = this;
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      loading: false,
			itemList: [],
			searchStr: "",
			selectVal: 'total_space',
      conditionNameList: [
        {
          label: "存储总数",
          value: "total_space"
				},
				{
          label: "已用",
          value: "used_space"
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
            getContent: item => _this.getField("tablespace", item),
            getHeaderContent: "表空间",
            tooltip: true,
            sortable: true,
            field: "tablespace"
          },
          {
            getContent: item => _this.getField("total_space", item),
            getHeaderContent: "存储总数(MB)",
            tooltip: true,
            sortable: true,
            field: "total_space"
          },
          {
            getContent: item => _this.getField("used_space", item),
            getHeaderContent: "使用(MB)",
            tooltip: true,
            sortable: true,
            field: "used_space"
          },
          {
            getContent: item => _this.getField("free_space", item),
            getHeaderContent: "空闲(MB)",
            tooltip: true,
            sortable: true,
            field: "free_space"
          },
          {
            getContent: item => _this.getField("diff_space", item),
            getHeaderContent: "增量(MB)",
            tooltip: true,
            sortable: true,
            field: "diff_space"
          },
          {
            getContent: item => _this.getField("avg_space", item),
            getHeaderContent: "均值(MB)",
            tooltip: true,
            sortable: true,
            field: "avg_space"
          },
          {
            getContent: item => _this.getField("used_rate", item),
            getHeaderContent: "使用率",
            tooltip: true,
            sortable: true,
            field: "used_rate"
          },
          {
            getContent: item => _this.getField("used_days", item),
            getHeaderContent: "可用天数",
            tooltip: true,
            sortable: true,
            field: "used_days"
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
			  limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        service: _this.param.service,
				[_this.selectVal]: _this.searchStr.trim(),
				starttime: formatDateTime((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd hh:mm:ss'),
				endtime: formatDateTime(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'),
				tablespace: _this.param.tablespace,
		 }
		},
	 //查询历史数据
		historyQuery() {
			   let _this = this;
      _this.loading = true;
      TableSpaceReportApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "tableSpaceReport",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.tableSpaceReport;
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
        normalFields = [
          "tablespace",
          "total_space",
          "used_days",
          "used_rate",
          "used_space",
          "avg_space",
          "diff_space",
          "free_space"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
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
      if(sort.order)
      _this.sortDirection = sort.order === 'descending' ? '-' : '+';
      _this.sortBy = sort.prop;
      _this.historyQuery();
    },
  }
};
</script>