<template>
  <div
    class="bread-container"
    ref="scrollCon"
    @DOMMouseScroll="handlescroll"
    @mousewheel="handlescroll"
  >
    <div class="bread-content" ref="scrollBody" :style="{left: tagBodyLeft + 'px'}">
      <div
        class="bread-item"
        v-for="(item,index) in tagsList"
        ref="tagsPageOpened"
        @click="linkTo(item)"
        :key="index"
      >
        <span class="bread-item__dot" :class="{'is-active': item.name === $route.name}" />
        <span class="bread-item__title">{{`${breadTitle[item.name]}`}}</span>
        <i class="bread-item__close el-icon-close" @click="close($event,item.name)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Mixins from "@/mixins/Mixins";
import { stopBubble } from '@/views/utils/utils';
import breadTitle from "@/views/components/breadcrumb/breadTitle.js";
export default {
  name: "MainBreadcrumb",
  mixins: [Mixins],
  props: {
    params: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentPageName: this.$route.name,
      tagBodyLeft: 0,
      refsTag: [],
      tagsCount: 1,
      breadTitle: breadTitle
    };
  },
  computed: {
    tagsList() {
      let _this = this;
      return _this.$store.state.menu.breadList;
    }
  },
  mounted() {
    let _this = this;
    //获得tag的dom
    _this.refsTag = _this.$refs.tagsPageOpened;
    setTimeout(() => {
      _this.refsTag.forEach((item, index) => {
        //当跳转的路由name等于dom name时则移动到次tag下
        if (
          _this.breadTitle[_this.$route.name] && _this.breadTitle[_this.$route.name].trim() === item.textContent.trim()
        ) {
          let tag = _this.refsTag[index];
          _this.moveToView(tag);
        }
      });
    }, 1); // 这里不设定时器就会有偏移bug
    _this.tagsCount = _this.tagsList.length;
  },
  methods: {
    close(event, name) {
      stopBubble(event);
      let _this = this;
      if (name === "alarm-list") return;
      let pageOpenedList = _this.$store.state.menu.breadList;
      let lastPageObj = pageOpenedList[0];
      if (_this.currentPageName === name) {
        let len = pageOpenedList.length;
        for (let i = 1; i < len; i++) {
          if (pageOpenedList[i].name === name) {
            if (i < len - 1) {
              lastPageObj = pageOpenedList[i + 1];
            } else {
              lastPageObj = pageOpenedList[i - 1];
            }
            break;
          }
        }
      } else {
        let tagWidth = event.target.parentNode.offsetWidth;
        this.tagBodyLeft = Math.min(_this.tagBodyLeft + tagWidth, 0);
      }
      _this.deleteBread({ name: name });
      pageOpenedList = _this.$store.state.menu.breadList;
      localStorage.pageOpenedList = JSON.stringify(pageOpenedList);
      if (this.currentPageName === name) {
        this.linkTo(lastPageObj);
      }
    },
    linkTo(item) {
      let routerObj = {};
      routerObj.name = item.name;
      if (item.params) {
        routerObj.params = item.params;
      }
      if (item.query) {
        routerObj.query = item.query;
      }
      this.$router.push(routerObj);
      localStorage.lastPageObj = JSON.stringify(routerObj);
    },
    handlescroll(e) {
      let type = e.type,
        delta = 0,
        _this = this;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      let left = 0;
      if (delta > 0) {
        left = Math.min(0, _this.tagBodyLeft + delta);
      } else {
        if (
          _this.$refs.scrollCon.offsetWidth - 100 <
          _this.$refs.scrollBody.offsetWidth
        ) {
          if (
            _this.tagBodyLeft <
            -(
              _this.$refs.scrollBody.offsetWidth -
              _this.$refs.scrollCon.offsetWidth +
              100
            )
          ) {
            left = _this.tagBodyLeft;
          } else {
            left = Math.max(
              _this.tagBodyLeft + delta,
              _this.$refs.scrollCon.offsetWidth -
                _this.$refs.scrollBody.offsetWidth -
                100
            );
          }
        } else {
          _this.tagBodyLeft = 0;
        }
      }
      _this.tagBodyLeft = left;
      stopBubble(e);
    },
    moveToView(tag) {
      let _this = this;
      //当标签偏离左边的距离小于
      if (tag.offsetLeft < -_this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + 10;
      } else if (
        tag.offsetLeft + 10 > -_this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth <
          -_this.tagBodyLeft + _this.$refs.scrollCon.offsetWidth - 100
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          _this.$refs.scrollCon.offsetWidth -
            100 -
            tag.offsetWidth -
            tag.offsetLeft -
            20
        );
      } else {
        // 标签在可视区域右侧
        _this.tagBodyLeft = -(
          tag.offsetLeft -
          (_this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) +
          20
        );
      }
    }
  },
  watch: {
    $route(to) {
      let _this = this;
      _this.currentPageName = to.name;
      //路由发生变化时更新面包屑
      _this.updatebread({
        name: to.name,
        path: to.path,
        params: to.params,
        query: to.query
      });
      //更新最后跳转的路由
      localStorage.lastPageObj = JSON.stringify({
        name: to.name,
        path: to.path,
        params: to.params,
        query: to.query
      });
      _this.$nextTick(() => {
        _this.refsTag.forEach((item, index) => {
          //当跳转路由等于点击dom的textContent则移动到这个dom
          if (_this.breadTitle[to.name].trim() === item.textContent.trim()) {
            let tag = _this.refsTag[index];
            _this.moveToView(tag);
          }
        });
      });
      //计算标签总数
      _this.tagsCount = _this.tagsList.length;
    }
  }
};
</script>