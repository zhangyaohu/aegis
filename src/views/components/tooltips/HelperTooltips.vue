<template>
  <div id="help-tooltip" :style="_styles" class="tooltip-wrapper" @mouseleave="mouseLeaveTooltip">
    <div class="tooltip-content">
      <div class="triangle" :style="{ top: `${setPosition()}%` }" />
      <div class="help-content" v-if="toolTips">
        <pre v-html="toolTips.content && toolTips.content"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { stopBubble } from '@/views/utils/utils';
import { mapState } from "vuex";
export default {
  name: "HeplerTooltips",
  mounted() {
    let _this = this;
    window.addEventListener('mousemove', _this.hideTooltip)
  },
  methods: {
    //监听鼠表离开事件
    mouseLeaveTooltip(event) {
      let _this = this;
      //如果dom节点未挂载则返回
      if (!_this.$el) return;
      //设置当前节点隐藏
      _this.$el.style.display = "none";
      _this.$el.style.transition = "display 0.5 ease-out";
      stopBubble(event);
    },
    setPosition() {
      let top = "",
        _this = this;
      let placement = _this.toolTips.placement;
      switch (placement) {
        case "top":
          top = "20";
          break;
        case "middle":
          top = "50";
          break;
        case "bottom":
          top = "80";
          break;
        default:
          top = placement;
      }
      return top;
    },
    hideTooltip($event) {
      let _this = this;
      //阻止事件冒泡
      stopBubble($event);
      if (!_this.$el) return;
      //隐藏帮助提示
      _this.$el.style.display = "none";
      //设置隐藏动画
      _this.$el.style.transition = "display 0.5s ease-out";
    }
  },
  destoryed() {
    let _this = this;
    window.removeEventListener("mousemove", _this.hideTooltip);
  },
  computed: {
    ...mapState({
      toolTips: state => state.helperTips.hepler
    }),
    //计算tip提示位置
    _styles() {
      let _this = this;
      return {
        top: `${
          _this.toolTips.position && _this.toolTips.position.top
            ? _this.toolTips.position.top
            : 0
        }px`,
        left: `${
          _this.toolTips.position && _this.toolTips.position.left
            ? _this.toolTips.position.left - 3
            : 0
        }px`,
        transform: `TranslateY(-${_this.setPosition()}%)`
      };
    }
  }
};
</script>
