<template>
 <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" 
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
<!---
     :goods="showGoods"
      showGoods() {
        return this.goods[this.currentType].list
      }
      根据this.currentType的类型获取goods中的list的数据
 
   -->
  
   <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>
 

<script>
  import HomeSwiper from './ChildComps/HomeSwiper'
  import RecommendView from './ChildComps/RecommendView'
  import FeatureView from './ChildComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'
  import GoodsList from 'components/content/goods/GoodsList'


  import { getHomeMultidata, getHomeGoods } from "network/home"
  import {debounce}  from "common/utils"


  export default {
    name: "Home",
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
      

    },
    data(){
      return {
        banners : [],
        recommends : [],
        goods : {
        //类型
          'pop': {page :0, list: []},
          'new': {page :0, list: []}, 
          'sell': {page :0, list: []}
        },
       currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
       showGoods() {
        return this.goods[this.currentType].list
      },
      activated() {
        this.$refs.scroll.scrollTo(0, this.saveY,0)
        this.$refs.scroll.refresh()
      },
      deactivated () {
        this.saveY = this.$refs.scroll.getScrollY()
      }
    },
      //异步操作
      created() {
      // 1.请求多个数据
      this.getHomeMultidata() //写this的目的是为了调用methods中的getHomeMultidata()，防止调用网络请求函数getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      

    },
    mounted(){
      /*
       const refresh = debounce(this.$refs.scroll.refresh(), 50)
        this.$bus.$on('emitImgLoad',() =>{
          refresh();
          console.log('-----');
      })
      */
     //事件图片加载完成的监听
      this.$bus.$on('emitImgLoad',() =>{
          this.$refs.scroll.refresh()
          console.log('-----');
      }
      );

    },
    methods: {
      
     /*
        事件监听相关的方法
     */
    
   tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
   },
      
       backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position) {
       // 1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000
        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page=this.goods[type].page+1//获取goods中的page
        getHomeGoods(type,page).then(res => {
          //将获取到的数据复制到goods变量的list数组中
         this.goods[type].list.push(...res.data.list)
          //将goods中的page+1方便下一次下拉时获取数据 
         this.goods[type].page+=1
          this.$refs.scroll.finishPullUp()
         })
      },
    },
  }
</script>

<style scoped>
 #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }

  .content {
  overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
/*
 .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }
  */
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>

