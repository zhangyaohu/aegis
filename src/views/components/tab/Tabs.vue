<template>
  <div class="mh-tab">
    <span
      v-for="(tab, index) in tabs"
      class="mh-tab__item"
			:class="{'active': currTab === tab.value}"
      @click="handleTabClick(tab)"
      :ref="`tab-pane_${tab.value}`"
      :key="index"
    >{{tab.label}}</span>
  </div>
</template>
<script>
export default {
  name: "tabs",
  data() {
    let _this = this;
    return {
      currTab: ""
    };
  },
  props: {
    tabs: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: "",
      required: true
    },
    tabPosition: {
      type: String,
      default: "top"
    }
  },
  methods: {
    handleTabClick(tab) {
      let _this = this;
      _this.$emit("tab-click", tab);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal === oldVal) return;
        this.currTab = newVal;
      }
    }
  }
};
</script>