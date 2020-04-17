<template>
  <div class="hepler-wrapper">
    <div @mousemove="showTooltip($event)" @click.stop="() => false">?</div>
  </div>
</template>

<script>
import { stopBubble } from '@/views/utils/utils';
import Mixins from "@/mixins/Mixins";
export default {
  name: "HeplerTrigger",
  mixins: [Mixins],
  data() {
    return {};
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ""
    },
    placement: {
      type: [String, Number],
      default: "middle",
      validator: val => {
        let position = ["top", "middle", "bottom"];
        if (position.includes(val)) {
          return true;
        } else return val > 0 && val < 100;
      }
    }
  },
  mounted() {
    let _this = this;
    _this.isDisabled();
    //监听页面变化更新位置
    window.addEventListener("resize", _this.updateTooltipPosition);
  },
  destroyed() {
    let _this = this;
    //监听页面变化更新位置
    window.removeEventListener("resize", _this.updateTooltipPosition);
  },
  methods: {
    //设置是否为
    isDisabled() {
      let _this = this;
      return _this.disabled;
    },
    //计算帮助图标的位置
    getPosition() {
      if (typeof this.$el.getBoundingClientRect === "function") {
        return this.$el.getBoundingClientRect();
      } else {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
      }
    },
    init() {
      let _this = this,
        toolTipsParam = {};
      //设置tooltips的参数
      toolTipsParam = {
        content: _this.content,
        placement: _this.placement,
        position: _this.getPosition()
      };
      //将参数添加到Vuex状态管理中
      return _this.updateHeplerToolTip({
        name: "hepler",
        data: toolTipsParam
      });
    },
    showTooltip(event) {
      //阻止事件冒泡
      stopBubble(event);
      let _this = this;
      _this.init().then(() => {
        //获得装载tooltips的dom
        const helpTooltip = document.querySelector("#help-tooltip");
        helpTooltip.style.display = "block";
        helpTooltip.style.transition = "block 0.5s ease-in";
      });
    },
    updateTooltipPosition() {
      let _this = this;
      //重新计算位置
      _this.init();
    }
  },
  computed: {
    isShowToolTip() {
      //计算是否展示toolTip
      const helpTooltip = document.querySelector("#help-tooltip");
      return helpTooltip ? helpTooltip.style.display === "block" : "";
    }
  }
};
</script>