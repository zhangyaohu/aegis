<template>
	<div>
		  <component :key="dlg.windowId" v-for="(dlg, index) in dialogList" :class="{ 'legacy-dialog-panel': !(index === dialogList.length - 1) }" :is="dlg.class" :assigned-id="dlg.windowId" :param="dlg.param" :style="{ 'z-index': dlg.zIndex }"/>
	</div>
</template>

<script>
var dialogClass = {};
import HandleAlarmDlg from '@/views/dialog/alarm/HandleAlarmDlg';
import ConfirmDlg from '@/views/dialog/confirmDlg/ConfirmDlg';
import ModifyUserDlg from '@/views/dialog/user/ModifyUserDlg';
import ModifyPwdDlg from '@/views/dialog/user/ModifyPwdDlg';
dialogClass.ConfirmDlg = ConfirmDlg;
dialogClass.ModifyPwdDlg = ModifyPwdDlg;
dialogClass.ModifyUserDlg = ModifyUserDlg;
dialogClass.HandleAlarmDlg = HandleAlarmDlg;
export default {
	 computed: {
		  dialogList: function () {
        let _this = this, list = [];
        _this.$store.state.dialogController.dialogIdList.forEach((windowId) => {
          list.push({
            windowId,
            class: dialogClass[_this.$store.state.dialogController.dialogObject[windowId].className],
            param: _this.$store.state.dialogController.dialogObject[windowId].param.windowParam,
            zIndex: _this.$store.state.dialogController.dialogObject[windowId].zIndex
          })
        });
        return list
      }
	 }
}
</script>