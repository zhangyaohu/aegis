<template>
  <div v-if="visiable">
    <div class="mh-drawer">
       <div class="mh-drawer__header">
      <slot name="header"></slot>
      <span class="mh-drawer__close el-icon-close" @click="$emit('close')"></span>
    </div>
    <div class="mh-drawer__body">
      <slot name="body"></slot>
    </div>
    <div class="mh-drawer__footer">
      <slot name="footer"></slot>
    </div>
    </div>
    <div class="mh-drawer__mask"></div>
  </div>
</template>

<script>
export default {
  name: "Drawer",
  props: {
    visiable: Boolean,
    param: Object | String | Array,
    close: {
      type: Function,
      default: () => {
        let _this = this;
        _this.visiable = false;
      }
    }
  },
  methods: {
    handleVisiable() {}
  },
  watch: {
    visiable: function(newVal, oldVal) {
      if (newVal !== oldVal) this.visiable = newVal;
    }
  }
};
</script>