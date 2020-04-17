<template>
  <page-template>
    <template slot="page-header">
      <span class="title">用户管理</span>
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
          style="padding: 0px  0px 0px;"
        />
      </span>
      <button class="btn-primary" style="margin-left: 10px;" @click="currSelectTab === 'list' ? queryList() : queryRoleList()">
        <i class="icon el-icon-search"></i>
        <span class="text">搜索</span>
      </button>
    </template>
    <template slot="page-table">
      <mh-table v-if="currSelectTab === 'list'" :data-source="dataSource" :loading="loading">
        <div slot="operate" slot-scope="scope"  v-if="scope.data.super !== '1'">
          <a class="a-link" @click="modifyUser(scope.data)">编辑</a>
          |
          <a class="a-link" @click="modifyPwd(scope.data)">修改密码</a>
        </div>
        <template slot="role" slot-scope="scope">
          <a class="a-link" @click="watchRole(scope.data)">所属角色</a>
        </template>
      </mh-table>
      <mh-table v-else :data-source="userRoleDataSource" :loading="loading"></mh-table>
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
    <template slot="page-footer">
      <user-roles-page v-if="showUserRoles" :param="userRolesParam" @close="showUserRoles = false"></user-roles-page>
    </template>
  </page-template>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import Tabs from "@/views/components/tab/Tabs";
import { formatDateTime } from "@/views/utils/utils";
import UserManagerApi from "@/views/config/user/userManagerApi";
import UserRolesPage from '@/views/config/user/components/UserRolesPage';
export default {
  mixins: [Mixins],
  name: "UserManagerPage",
  components: {
    "mh-tabs": Tabs,
    "user-roles-page": UserRolesPage
  },
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
      selectVal: 'user_name',
      searchStr: '',
      sortDirection: '-',
      sortBy: 'gmt_create',
      showUserRoles: false,
      userRolesParam: {},
      conditionNameList: [
        {
          label: '用户名称',
          value: 'user_name'
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
            getContent: item => _this.getField("username", item),
            getHeaderContent: "名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("mail", item),
            getHeaderContent: "邮箱",
            tooltip: true
          },
          {
            getContent: item => _this.getField("ww", item),
            getHeaderContent: "旺旺",
            tooltip: true
          },
          {
            getContent: item => _this.getField("mobile", item),
            getHeaderContent: "手机",
            tooltip: true
          },
          {
            getContent: item => _this.getField("role", item),
            getHeaderContent: "角色",
            tooltip: true
          },
          {
            getContent: item => _this.getField("super", item),
            getHeaderContent: "管理员",
            tooltip: true
          },
          {
            getHeaderContent: "操作",
            tooltip: true,
            type: "slot",
            slotName: "operate"
          },
          {
            getHeaderContent: "所属角色",
            tooltip: true,
            type: "slot",
            slotName: "role"
          },
          {
            getContent: item => _this.getField("gmt_modified", item),
            getHeaderContent: "编辑时间",
            tooltip: true,
            sortable: true,
            field: 'gmt_modified'
          }
        ]
      },
      userRoleDataSource: {
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
            getContent: item => _this.getField("role_id", item),
            getHeaderContent: "角色ID",
            tooltip: true
          },
          {
            getContent: item => _this.getField("role_name", item),
            getHeaderContent: "角色名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("user_id", item),
            getHeaderContent: "用户ID",
            tooltip: true
          },
          {
            getContent: item => _this.getField("user_name", item),
            getHeaderContent: "用户名称",
            tooltip: true
          },
          {
            getContent: item => _this.getField("user_ww", item),
            getHeaderContent: "旺旺",
            tooltip: true
          },
          {
            getContent: item => _this.getField("gmt_create", item),
            getHeaderContent: "创建时间",
            tooltip: true,
            sortable: true,
            field: 'gmt_modified'
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
    toggleTab(tab) {
      let _this = this;
      _this.pageIndex = 1; _this.pageSize = 10, _this.total = 0;
      if (tab.value === _this.currSelectTab) return;
      _this.currSelectTab = tab.value;
      _this.currSelectTab === "list"
        ? _this.queryList()
        : _this.queryRoleList();
    },
    getCondition() {
      let _this = this;
      return {
        limit: _this.pageSize,
        start: (_this.pageIndex - 1) * _this.pageSize,
        [_this.selectVal]: _this.searchStr.trim(),
        sort: `${_this.sortDirection}${_this.sortBy}`
      };
    },
    //填充数据
    getField(field, item) {
      let _this = this,
        normalFields = [];
      if (_this.currSelectTab === "list")
        normalFields = [
          "id",
          "username",
          "ww",
          "role",
          "mobile",
          "super",
          "mail"
        ];
      else
        normalFields = [
          "id",
          "role_id",
          "role_name",
          "user_id",
          "user_name",
          "user_ww"
        ];
      if (normalFields.includes(field)) return item[field];
      if (field === "gmt_modified" || field === "gmt_create")
        return formatDateTime(item[field], "yyyy-MM-dd hh:mm:ss");
    },
    queryList() {
      let _this = this;
      _this.loading = true;
      UserManagerApi.queryList(_this.getCondition()).then(resp => {
        _this
          .updateTableList({
            tableName: "user",
            list: resp.data
          })
          .then(() => {
            _this.itemList = _this.$store.state.db.user;
            _this.total= resp.total;
            _this.loading = false;
          })
          .catch(() => {
            _this.loading = false;
          });
      });
    },
    //所属角色
    queryRoleList() {
      let _this = this;
      _this.loading = true;
      UserManagerApi.queryRoleList(_this.getCondition()).then(resp => {
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
   //修改用户
    modifyUser(param) {
      let _this = this;
      _this.openDialog("ModifyUserDlg", {
        param,
        ok: (msg) => {
          return UserManagerApi.modifyUser(msg)
                               .then((resp) => {
                                  _this.$notify.info({message: resp.data, position: 'top-right'})
                                 _this.queryList();
                               })
        }
      });
    },
    //修改密码
    modifyPwd(param) {
      let _this = this;
      _this.openDialog("ModifyPwdDlg", {
        param,
        ok: (msg) => {
            return UserManagerApi.modifyPwd(msg)
                               .then((resp) => {
                                 _this.$notify.info({message: resp.data, position: 'top-right'})
                                 _this.queryList();
                               })
        }
      })
    },
    //改变每页条数
    handleSizeChange(size) {
      let _this = this;
      if (size === _this.pageSize) return;
      _this.pageSize = size;
      _this.pageIndex = 1;
      _this.currSelectTab === "list"
        ? _this.queryList()
        : _this.queryRoleList();
    },
    //改变当前页数
    handleCurrentChange(pageIndex) {
      let _this = this;
      if (pageIndex === _this.pageIndex) return;
      _this.pageIndex = pageIndex;
     _this.currSelectTab === "list"
        ? _this.queryList()
        : _this.queryRoleList();
    },
     //排序
    handleSort(sort) {
      let _this = this;
      if(sort.order)
      _this.sortDirection = sort.order === 'descending' ? '-' : '+';
      _this.sortBy = sort.prop;
       _this.currSelectTab === "list"
        ? _this.queryList()
        : _this.queryRoleList();
    },
    //查看所属角色
    watchRole(param) {
      let _this = this;
      //携带参数
      _this.userRolesParam = param;
      _this.showUserRoles = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>