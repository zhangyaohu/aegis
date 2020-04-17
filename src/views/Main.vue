<template>
  <div class="app-container">
    <Header></Header>
    <!--侧边菜单栏-->
    <Section-Menu :menuList="getMenuList"></Section-Menu>
    <el-scrollbar class="scrollbar__wrap">
      <div class="main-content">
        <!--上边面包屑-->
        <main-breadcrumb :params="$store.state.menu.breadList"></main-breadcrumb>
        <span class="back-to__home el-icon-arrow-down">
          <ul class="back-to__home___content">
            <li @click="linkTo('home')">回到首页</li>
            <li @click="linkTo('other')">关闭其他</li>
          </ul>
        </span>
        <router-view />
        <!--公司信息-->
        <div style="text-align: center;font-size:12px;">Copyright © 杭州明和科技股份有限公司 保留所有权利</div>
      </div>
    </el-scrollbar>
		<dialog-controller/>
    <hepler-tooltips/>
  </div>
</template>

<script>
import MainBreadcrumb from "@/views/components/breadcrumb/MainBreadcrumb";
import HelperTooltips from "@/views/components/tooltips/HelperTooltips";
import SectionMenu from "@/views/components/SectionMenu";
import Header from "@/views/components/Header";
import Mixins from "@/mixins/Mixins";
export default {
  name: "Main",
  mixins: [Mixins],
  components: {
    SectionMenu,
    Header,
    "main-breadcrumb": MainBreadcrumb,
    "hepler-tooltips": HelperTooltips
  },
  data() {
    return {};
  },
  mounted() {
    let _this = this;
    //初始化打开页面更新
    if(localStorage.pageOpenedList)
    _this.updatebread(JSON.parse(localStorage.pageOpenedList));
    //跳转到最后打开的页面
    if(localStorage.lastPageObj)
    _this.$router.push({ name: JSON.parse(localStorage.lastPageObj).name });
    //设置最后打开的皮肤
    if(localStorage.theme)
    _this.updateSkin(localStorage.theme);
    else
      _this.updateSkin('default');
  },
  methods: {
    linkTo(param) {
      let _this = this;
      if(param === 'home') {
        _this.$router.push({name: 'alarm-list'})
      }
      if(param === 'other') {
        _this.closeAllBread()
         _this.$router.push({name: 'alarm-list'})
      }
    }
  }
};
</script>