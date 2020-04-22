<template>
  <page-template>
    <template slot="page-header">
      <span class="title">角色管理</span>
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
          <a class="a-link" v-if="scope.data.super !== 1" @click="$router.push({name: 'user-manager'})">查看用户列表</a>
        </template>
        <template slot="host_g">
          <a class="a-link" @click="$router.push({name: 'host-group'})">查看主机群组</a>
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
import RoleManagerApi from "@/views/config/role/roleManagerApi";
export default {
  mixins: [Mixins],
  name: "RoleManagerPage",
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
      sortBy: 'gmt_create',
      sortDirection: '-',
      selectVal: 'name',
      searchStr: '',
      conditionNameList: [
        {
          label: '角色名称',
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
            getContent: item => _this.getField("id", item),
            getHeaderContent: "编号",
            tooltip: true
          },
          {
            getContent: item => _this.getField("name", item),
            getHeaderContent: "名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("description", item),
            getHeaderContent: "描述",
            tooltip: true
          },
          {
            getContent: item => _this.getField("kind", item),
            getHeaderContent: "角色类型",
            tooltip: true
          },
          {
            getHeaderContent: "展开标志",
            tooltip: true,
            type: "slot",
            slotName: "type"
          },
          {
            getHeaderContent: "用户列表",
            tooltip: true,
            type: "slot",
            slotName: "user_g"
          },
          {
            getContent: item => _this.getField("host_gids", item),
            getHeaderContent: "主机群组",
            tooltip: true,
            type: "slot",
            slotName: "host_g"
          },
          {
            getContent: item => _this.getField("operate", item),
            getHeaderContent: "操作",
            tooltip: true
          },
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "创建时间",
            tooltip: true,
            sortable: true,
            field: 'gmt_create'
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
        normalFields = ["id", "description", "type", "name", "kind", "operate"];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        sort: `${_this.sortDirection}${_this.sortBy}`,
        [_this.selectVal]: _this.searchStr.trim()
      };
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      RoleManagerApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "roleManager",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.roleManager;
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