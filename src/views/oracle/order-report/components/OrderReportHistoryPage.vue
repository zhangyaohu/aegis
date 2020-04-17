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
import Mixins from '@/mixins/Mixins';
import Drawer from "@/views/components/Drawer/Drawer";
import { formatDateTime } from '@/views/utils/utils';
import OrderReportApi from "@/views/oracle/order-report/orderReportApi";
export default {
	name: "OrderReportHistoryPage",
	mixins: [Mixins],
  components: {
    "mh-drawer": Drawer
  },
  props: {
    param: {
      type: Object,
      default: () => {
        return {};
      }
    },
    visiable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let _this = this;
    return {
      loading: false,
      selectVal: "owner",
      searchStr: "",
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      sortDirection: "-",
      sortBy: "gmt_create",
      conditionNameList: [{
				label: '所有者',
				value: 'owner'
			}],
      itemList: [],
      dataSource: {
        getItemList: () => _this.itemList,
        handleSort: _this.handleSort,
        fields: [
          {
            getContent: item => _this.getField('gmt_create', item),
            getHeaderContent: "更新时间",
            sortable: true,
						tooltip: true,
						field: 'gmt_create'
          },
          {
            getContent: item => _this.getField('owner', item),
            getHeaderContent: "所有者",
            tooltip: true
          },
          {
            getContent: item => _this.getField('sequence', item),
            getHeaderContent: "序列名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField('min_value',  item),
            getHeaderContent: "最小值",
            tooltip: true
          },
          {
            getContent: item => _this.getField('delta', item),
            getHeaderContent: "递增",
            tooltip: true
          },
          {
            getContent: item => _this.getField('last_number',  item),
            getHeaderContent: " 最后序列号",
            tooltip: true
          },
          {
            getContent: item => _this.getField('incr_by', item),
            getHeaderContent: "每天增量",
            tooltip: true
          },
          {
            getContent: item => _this.getField('cache_size', item),
            getHeaderContent: "缓存数",
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
    getCondition() {
      let _this = this;
      return {
        [_this.selectVal]: _this.searchStr,
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        sort: `${_this.sortDirection}${_this.sortBy}`,
				sequence: _this.param.sequence,
				starttime: formatDateTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000 ,  'yyyy-MM-dd hh:mm:ss'),
				endtime: formatDateTime(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
      };
    },
    historyQuery() {
			let _this = this;
      return OrderReportApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "orderReportHistory",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.orderReportHistory;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    handleSizeChange(size) {
      let _this = this;
      if (_this.pageSize === size) return;
      _this.pageIndex = 1;
      _this.historyQuery();
    },
    handleCurrentChange(pageIndex) {
      let _this = this;
      if (_this.pageIndex === pageIndex) return;
      _this.historyQuery();
    },
    handleSort(sort) {
      let _this = this;
      _this.sortDirection = sort.order === "ascending" ? "+" : "-";
      _this.sortBy = sort.prop;
      _this.historyQuery();
		},
		getField(field,  item) {
			let _this = this,
        normalFields = [
          "owner",
          "sequence",
          "min_value",
          "max_value",
          "cache_size",
          "last_number",
					"incr_by",
					"last_number",
					"delta"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
		}
  }
};
</script>