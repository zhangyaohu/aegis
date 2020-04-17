<template>
  <section class="mh-menu">
    <el-scrollbar style="height:100%;" wrapStyle="overflow-x': hidden;margin-right:-18px;" :vertical="true">
      <el-menu mode="vertical" 
               :background-color="menu_bgColor"
               :text-color="menu_textColor"
               :default-active="defaultActive" unique-opened :collapse="isCollapse"
               class="el-menu-vertical-demo" ref="menu">
        <template v-for="menu in menuList">
          <el-menu-item v-if="menu.children.length === 0 && menu.type === 'link'" :index="`${menu.path}`"
                        :key="`${menu.path}`"
                        @click="getCurrentPath(menu.path)">
            <i :class="menu.icon" class="iconfont"></i>
            <span slot="title" class="title">{{menu.title}}</span>
          </el-menu-item>
          <el-menu-item v-if="menu.children.length === 0 && menu.type === 'button'"
            :key="`button-${menu.path}`"
            @click="handleAsyncData">
            <i :class="menu.icon" class="iconfont"></i>
            <span slot="title" class="title">{{menu.title}}</span>
          </el-menu-item>
          <el-submenu :index="`${menu.title}-${index}`" v-if="menu.children.length > 0" :key="`${menu.title}-${index}`">
            <template slot="title" v-if="menu.type==='button'">
              <i :class="menu.icon"></i>
              <span class="title" v-if="!isCollapse">{{menu.title}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(l3menu, index) in menu.children" :key="index" :index="`${l3menu.path.split('/')[1]}`"
                            @click="getCurrentPath(l3menu.path)">
                <template slot="title">
                  <i :class="l3menu.icon" class="iconfont"></i>
                  <span @click="getCurrentPath(l3menu.path)"  class="title">{{l3menu.title}}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
      <div  class="mh-menu__collapse" @click="collapse" ref="collapse">
        <i class="el-icon-d-arrow-right" v-if="isCollapse"></i>
        <i class="el-icon-d-arrow-left" v-if="!isCollapse"></i>
      </div>
  </el-scrollbar>
  </section>
</template>

<script>
import { stopBubble } from '@/views/utils/utils';
import Mixins from '@/mixins/Mixins';
export default {
  name: "SectionMenu",
  mixins: [Mixins],
	 props: {
      menuList: {
        type: Array,
        default: []
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isCollapse: false
      }
    },
    mounted() {
      let _this = this;
      _this.$refs.collapse.style.marginLeft = "115pt";
    },
    methods: {
      //获得当前页面路由
      getCurrentPath(path) {
        let _this = this;
        _this.$router.push({name: path});
        stopBubble(event);
      },
      //左侧菜单收放
      collapse() {
        let _this = this, mainpath =  document.querySelector('.mh-menu'),
        maincontent = document.querySelector('.scrollbar__wrap');
        self.isCollapse = !self.isCollapse;
        if (self.isCollapse) {
          _this.$refs.collapse.style.marginLeft = "23pt";
          mainpath.style.width = '38pt';
          maincontent.style.width = 'calc(100% - 40pt)';
          mainpath.style.transition = 'width .3s ease-out';
          maincontent.style.transition = "width .3s ease-out";
          _this.$refs.collapse.style.transition = "margin-left .3s ease-out";
        } else {
          _this.$refs.collapse.style.marginLeft = "115pt";
          mainpath.style.width = '130pt';
          maincontent.style.width = 'calc(100% - 134pt)';
          mainpath.style.transition = 'width .2s ease-out';
          maincontent.style.transition = "width .2s ease-out";
          _this.$refs.collapse.style.transition = "margin-left .2s ease-in";
        }
      }
    },
    computed: {
      menu_bgColor() {
        let _this = this;
        if(_this.$store.state.menu.skin) {
          switch(_this.$store.state.menu.skin){
            case 'dark':
              return '#222';
            case 'light':
              return "#fff";
            case 'blue':
              return  '#409EFF';
            default: 
               return 'rgb(51, 51, 102)'
          }
        }else {
          return 'rgb(51, 51, 102)';
        }
      },
      menu_textColor() {
        let _this = this;
        if(_this.$store.state.menu.skin) {
          switch(_this.$store.state.menu.skin){
            case 'dark':
              return '#fff';
            case 'light':
              return "#222";
            case 'blue':
              return  '#fff';
            default: 
               return '#fff'
          }
        }else {
          return '#fff';
        }
      },
      defaultActive() {
        let _this = this;
        return _this.$route.path.split('/')[2];
      },
      _wrapStyle(){
        return {
           'maring-right': '0px!important',
           'background': 'red',
           'overflow-x': 'hidden'
        }
      }
    },
    watch: {
      isCollapse: function (newVal, oldVal) {
        if (newVal !== undefined && newVal !== oldVal)
          return newVal;
      }
    }
};
</script>