<template>
  <div class="dialog-container" ref="dialogContainer" :style="getZIndex">
    <div class="dialog-wrapper" :style="contentStyles">
      <div class="dialog-content" :style="_style" :key="1">
        <div class="el-dialog__header" @mousedown="handleMoveStart">
          <slot name="header"></slot>
        </div>
        <el-scrollbar class="dialog-scroller___wrapper">
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
        </el-scrollbar>
        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { stopBubble } from "@/views/utils/utils";
import Mixins from "@/mixins/Mixins";

export default {
  props: ["width", "height", "drag"],
  name: "DialogTemplate",
  mixins: [Mixins],
  computed: {
    getZIndex() {
      let self = this,
        containerzIndex = 0;
      if (self.isMounted)
        containerzIndex = Math.ceil(
          parseInt(self.$refs.dialogContainer.style.zIndex)
        );
      if (containerzIndex) {
        containerzIndex = containerzIndex + 1;
      }
      return {
        "z-index": containerzIndex
      };
    },
    _style() {
      let self = this;
      return {
        maxHeight: self.height ? "100%" : "40vh",
        height: self.height ? "100%" : null,
        width: self.getContentWidth()
      };
    },
    contentStyles() {
      let style = {};
      style.left = `${this.mouseEndPoint.left}px`;
      style.top = `${this.mouseEndPoint.top}px`;
      return style;
    }
  },
  mounted() {
    let self = this;
    self.isMounted = true;
    self.draggable = self.drag ? self.drag : true;
  },
  data() {
    return {
      isMounted: false,
      draggable: true,
      mouseStartPoint: { left: 0, top: 0 },
      mouseEndPoint: { left: 0, top: 0 },
      mouseDragDown: false,
      basePoint: { left: 0, top: 0 },
      moveTarget: null
    };
  },
  methods: {
    handleMoveStart(event) {
      var dragDom = document.querySelector(".el-dialog__header");
      //阻止所选dom内容被选中
      dragDom.onselectstart = dragDom.ondrag = function() {
        return false;
      };
      if (!this.draggable) return;
      if (event.target.hasOwnProperty("close"))
        //点关闭按钮不能移动对话框
        return;
      //判断是否可以移动
      this.mouseDragDown = true;
      //移动时x轴起始位置
      this.mouseStartPoint.left = Number(
        document.querySelector(".dialog-wrapper").style.left.replace(/px/, "")
      );
      //移动时y轴其实位置
      this.mouseStartPoint.top = Number(
        document.querySelector(".dialog-wrapper").style.top.replace(/px/, "")
      );
      //移动目标
      this.moveTarget = document.querySelector(".dialog-content");
      //开始移动位置
      this.basePoint = { left: event.pageX, top: event.pageY };
      //监听移动事件
      document.addEventListener("mousemove", this.handleMoveMove, false);
      //监听鼠标up事件
      document.addEventListener("mouseup", this.handleMoveEnd, false);
      event.preventDefault();
      stopBubble(event);
    },

    handleMoveMove(event) {
      if (!this.mouseDragDown || this.moveTarget == undefined) return;
      //移动x轴距离
      var mousX = event.pageX - this.basePoint.left;
      //移动y轴距离
      var mousY = event.pageY - this.basePoint.top;
      //x轴距离起始位置距离
      let left = mousX + this.mouseStartPoint.left;
      //y轴距离其实位置距离
      let top = mousY + this.mouseStartPoint.top;
      //如果left， top的绝对值小于等于0证明没有发生移动
      if (Math.abs(left) <= 0 || Math.abs(top) <= 0) return;
      // offsetWidth、offsetHeight 当前元素的宽度
      // innerWidth、innerHeight 浏览器可视区的宽度和高度

      // 获取弹窗在页面中距X轴的最小、最大 位置;
      let minX =
        -(document.documentElement.clientWidth - this.moveTarget.offsetWidth) /
        2;
      let maxX =
        (document.documentElement.clientWidth - this.moveTarget.offsetWidth) /
        2;
      if (left <= minX) {
        left = minX;
      } else if (left >= maxX) {
        left = maxX;
      }
      // 获取弹窗在页面中距Y轴的最小、最大 位置
      let minY =
        -(
          document.documentElement.clientHeight - this.moveTarget.offsetHeight
        ) / 2;
      let maxY =
        (document.documentElement.clientHeight - this.moveTarget.offsetHeight) /
        2;
      if (top <= minY) {
        top = minY;
      } else if (top >= maxY) {
        top = maxY;
      }
      this.mouseEndPoint = { left: left, top: top };
      event.preventDefault();
      stopBubble(event);
    },

    handleMoveEnd(event) {
      this.mouseDragDown = false;
      this.moveTarget = null;
      //移除鼠标移动监听事件
      document.removeEventListener("mousemove", this.handleMoveMove);
      //移除鼠标按下事件
      document.removeEventListener("mousedown", this.handleMoveStart);
      //阻止事件默认行为
      event.preventDefault();
      //阻止事件冒泡
      stopBubble(event);
    },
    getContentWidth() {
      let self = this;
      if (typeof self.width === "string") return `${self.width}`;
      else if (typeof self.width === "number") return `${self.width}px`;
      else return "40vw";
    }
  },

  watch: {
    getZIndex(newVal, oldVal) {
      if (newVal !== oldVal) {
        return newVal;
      }
    }
  }
};
</script>
