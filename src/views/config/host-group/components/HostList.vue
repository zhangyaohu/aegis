<template>
  <detail-template>
    <template slot="header">
      <span class="detail-page__back el-icon-back" @click="$emit('close')">回到主机群组</span>
    </template>
    <template slot="body">
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
    </template>
  </detail-template>
</template>

<script>
import Mixins from '@/mixins/Mixins';
import { formatDateTime } from '@/views/utils/utils';
import HostGroupApi from "@/views/config/host-group/hostGroupApi";
export default {
	name: "HostList",
	mixins: [Mixins],
  props: {
    param: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    let _this = this;
    return {
      loading: false,
      total: 0,
      selectVal: "host_name",
      searchStr: "",
      pageIndex: 1,
      pageSize: 20,
      conditionNameList: [
				{
					label: '主机名称',
					value: 'host_name'
				},
				{
					label: '群组名称',
					value: 'group_name'
				}
			],
			itemList: [],
			sortDirection: '-',
			sortBy: 'gmt_create',
      dataSource: {
        getItemList: () => _this.itemList,
        handleSort: _this.handleSort,
        fields: [
          {
            getHeaderContent: "编号",
            getContent: item => _this.getField("id", item),
            field: "id",
            tooltips: true
          },
          {
            getHeaderContent: "群组ID",
            getContent: item => _this.getField("group_id", item),
            field: "group_id",
            tooltips: true
          },
          {
            getHeaderContent: "群组名称",
            getContent: item => _this.getField("group_name", item),
            field: "group_name",
            tooltips: true
          },
          {
            getHeaderContent: "主机ID",
            getContent: item => _this.getField("host_id", item),
            field: "host_id",
            tooltips: true
          },
          {
            getHeaderContent: "主机名称",
            getContent: item => _this.getField("host_name", item),
            field: "host_name",
            tooltips: true
          },
          {
            getHeaderContent: "创建时间",
            getContent: item => _this.getField("gmt_create", item),
            field: "gmt_create",
            tooltips: true,
            sortable: true
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
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
				sort: `${_this.sortDirection}${_this.sortBy}`,
				group_id: _this.param.id
      };
    },
    //查询数据
    queryList() {
      let _this = this;
      _this.loading = true;
      HostGroupApi.queryHostList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "hostList",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.hostList;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    //改变页码
    handleSizeChange(size) {
			let _this = this;
			if(_this.pageSize === size) return;
			_this.pageSize = size;
			_this.pageIndex = 1;
			_this.queryList();
		},
    //改变当前页
    handleCurrentChange(page) {
			let _this = this;
			if(_this.pageIndex === page) return;
			_this.pageIndex = page;
			_this.queryList();
		},
    getField(field , item) {
			let _this = this, normalFields = ['id','host_id', 'host_name', 'group_id', 'group_name'];
			if(normalFields.includes(field)) return item[field];
			if(field === 'gmt_create') return formatDateTime(item[field], 'yyyy-MM-dd hh:mm:ss');
		},
		handleSort(e) {
			let _this = this;
			if(!e.order) return;
			_this.sortDirection = e.order === 'ascending' ? '+' : '-';
			_this.sortBy = e.prop;
			_this.queryList(); 
		}
  }
};
</script>