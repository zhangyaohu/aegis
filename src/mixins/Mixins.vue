<script>
import { mapActions, mapGetters, mapState } from "vuex";
import {getUniqueId} from '@/views/utils/utils';

export default {
  name: "Mixins",
  computed: {
    ...mapGetters({
      getMenuList: "setMenuList",
      dbData: "getList"
    }),
    ...mapState({
      dialogObject: state => state.dialogController.dialogObject
    }),
    dialogId() {
      //弹出框Id;
      let _this = this, id = '';
      //遍历弹出框对象得到当前弹出框的Id,注意弹出框必须写明组件名
      Object.keys(_this.dialogObject).forEach(dialogId => {
        if(dialogId.indexOf(_this.$options.name) >= 0) {
           id = dialogId;
        }
      })
      return id;
    },
    dialogData() {
      let _this = this;
      return _this.$store.state.dialogController.dialogObject[_this.dialogId]
    }
  },
  methods: {
    ...mapActions({
      updateMenuList: "updateMenuList",
      updateTableList: "updateTableList",
      updatebread: "updatebread",
      deleteBread: "deletebread",
      _openDialog: "openDialog",
      closeDialog: 'closeDialog',
      updateHeplerToolTip: 'updateHeplerToolTip',
      updateSkin: 'updateSkin',
      closeAllBread: 'closeAllBread'
		}),
		//弹框生成器
    openDialog(className, param) {
			//默认最大垂直浮层999;
      let _this = this,
				maxZIndex = 999;
			//当zIndex的值大于最大浮层时最大浮层等于该值
      for (let i in Object.keys(_this.dialogObject)) {
        if (_this.dialogObject[Object.keys(_this.dialogObject)[i]].zIndex > maxZIndex) {
          maxZIndex = _this.dialogObject[Object.keys(_this.dialogObject)[i]].zIndex;
        }
      }
      let zIndex = maxZIndex + 1;
      let windowId = `${className}-${getUniqueId()}`;//设定弹框Id;
      return  _this._openDialog({
        id: windowId,
        parentWindowId: _this.windowId,
        zIndex: zIndex,
        className: className,
        param
      });
    }
  }
};
</script>