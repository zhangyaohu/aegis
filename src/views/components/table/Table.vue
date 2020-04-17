<template>
  <el-table :data="itemList" @sort-change="handleSort"
            @selection-change="handleSelection"
            v-loading="load"
            @row-click="handSingleSelect"
            element-loading-spinner="loading-box"
            border
            :highlight-current-row="type === 'radio' ? true : false">
    <span slot="empty" class="table-nodata">
       <p class="empty-text" v-text="'暂无数据'"></p>
    </span>
    <el-table-column :type="tableType" width="50px" v-if="tableType && tableType==='selection'"></el-table-column>
    <el-table-column :type="tableType" width="50px" v-if="tableType && tableType==='radio'">
      <template slot-scope="scope">
        <el-radio :label="scope.row.uuid" v-model="templateRadio">&nbsp</el-radio>
      </template>
    </el-table-column>
    <template  v-for="(item, index) in columns">
       <el-table-column
                     :key="index"
                     :prop="item.field"
                      v-if="item.type!=='slot'"
                     :sortable="item.sortable"
                     :render-header="renderHeader.bind(this, ...arguments)"
                     :show-overflow-tooltip="item.tooltip && item.tooltip">
      <template slot-scope="scope">
        <span>{{item.getContent &&
          item.getContent(scope.row)}}
        </span>
      </template>
      </el-table-column>
       <el-table-column v-if="item.type==='slot'"
                      :show-overflow-tooltip="item.tooltip && item.tooltip"
                      :render-header="renderHeader.bind(this, ...arguments)"
                      :key="index">
        <template slot-scope="scope">
          <slot :name="`${item.slotName}`" :data="scope.row"></slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
  export default {
    name: "Table",
    props: {
      dataSource:{
        type:Object,
        default: () => {
          return {}
        },
        validate:(value) => {
          if(typeof(value) !== 'object'){
            throw new Error('Expend value is object')
          }
        },
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      rowClick: {
        type: Function
      },
      type: {
        type: String,
        default: ''
      }
    },
    computed: {
      //表格数据
      itemList () {
        let self = this;
        return self.dataSource.getItemList() || []
      },
      //表格排序
      handleSort(){
				let self = this;
				 if(self.dataSource.handleSort)
				return self.dataSource.handleSort;
				return () => {}
      },
      //表格多选
      handleSelection(){
        let self = this;
        if(self.dataSource.handleSelection)
        return self.dataSource.handleSelection;
        return () => {}
      },
      //设置表格类型为多选或者单选
      tableType(){
        let self = this;
        if(self.type) return self.type;
        return self.dataSource.type;
      },
      //获得表格列
      columns() {
        let self = this;
        return self.dataSource.fields;
      },
      load(){
        //设置请求数据时loading
        let self = this;
        return self.loading;
      },
      handSingleSelect(){
        let self = this;
        //表格单选
        if(self.dataSource.handSingleSelect){
          return self.dataSource.handSingleSelect;
        }
        return () => {}
      },
      templateRadio(){
        let self = this;
        //表格单选
        if(self.dataSource.templateRadio)
        return self.dataSource.templateRadio();
      },
    },
    methods: {
      renderHeader(item, { column, $index }, h) {
        //处理特殊形式的表头
        if(item.renderHeader) {
          return item.renderHeader(h, item);
        }else{
          //内容溢出时不换行并且添加title属性
          return h('el-tooltip', {
            attrs: {
              effect:"dark",
              content:`${item.getHeaderContent}`,
              placement:"top"
            }
          }, [
            h('span', {
              class: 'table_th'
            },   [item.getHeaderContent])
          ])
        }
      },
    }
  }
</script>
