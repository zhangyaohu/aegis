<template>
	<detail-template>
		<template slot="header">
      <span class="detail-page__back el-icon-back" @click="$emit('close')">回到活动会话历史</span>
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
import SectionSpaceReportApi from "@/views/oracle/sectionspace-report/SectionSpaceReportApi";
export default {
	name:  'SectionSpaceHistoryPage',
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
      selectVal: "owner",
			searchStr: "",
			pageIndex: 1,
			pageSize: 10,
      conditionNameList: [
        {
          label: "创建者",
          value: "owner"
        }
      ],
      itemList: [],
			loading: false,
			total: 0,
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
            getContent: item => _this.getField("owner", item),
            getHeaderContent: "创建者",
            tooltip: true
          },
          {
            getContent: item => _this.getField("segment_name", item),
            getHeaderContent: "段名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("segment_type", item),
            getHeaderContent: "段类型",
            tooltip: true
          },
          {
            getContent: item => _this.getField("partition_name", item),
            getHeaderContent: "分区名",
            tooltip: true
          },
          {
            getContent: item => _this.getField("used_space", item),
            getHeaderContent: "使用(MB)",
            tooltip: true
          },
          {
            getContent: item => _this.getField("diff_space", item),
            getHeaderContent: "增量(MB)",
            tooltip: true
					},
					 {
            getContent: item => _this.getField("last_ddl_time", item),
            getHeaderContent: "最后DDL时间",
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
    //设置查询条件
    getCondition() {
      let _this = this;
      return {
        [_this.selectVal]: _this.searchStr.trim(),
				segment_name: _this.param.segment_name,
				limit: _this.pageSize,
				start: (_this.pageIndex - 1) * _this.pageSize,
				starttime: formatDateTime(new Date(_this.param.gmt_create).getTime() - 30 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd hh:mm:ss'),
				endtime: formatDateTime(new Date(_this.param.gmt_create).getTime(), 'yyyy-MM-dd hh:mm:ss'),
				service: _this.param.service
      };
    },
    //查询数据
    queryList() {
      let _this = this;
      _this.loading = true;
      _this.pageIndex = 1;
      SectionSpaceReportApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "role",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.role;
            _this.total = resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    //填充表格
    getField(field, item) {
      let _this = this,
        normalFields = [
          "used_space",
          "diff_space",
          "segment_name",
          "segment_type",
					"partition_name",
					"owner"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create" || field === "last_ddl_time")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
		},
		 //改变每页条数
    handleSizeChange(size) {
      let _this = this;
      if (size === _this.pageSize) return;
      _this.pageSize = size;
      _this.pageIndex = 1;
      _this.queryList()
    },
    //改变当前页数
    handleCurrentChange(pageIndex) {
      let _this = this;
      if (pageIndex === _this.pageIndex) return;
      _this.pageIndex = pageIndex;
      _this.queryList()
    },
  }
}
</script>