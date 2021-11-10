<template>
    <div id="detail">
    <DetailNavBar class="detail-navbar"></DetailNavBar>
      <Scroll class="content">
       
       <detail-swipper :topImages="topImages"></detail-swipper>
     <detail-base-info :goods="goods"/>
     </Scroll>
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwipper from './childComps/DetailSwipper'
import DetailBaseInfo from './childComps/DetailBaseInfo'

import {getDetail, Goods} from 'network/detail'

import Scroll from 'components/common/scroll/Scroll'

export default {
    name: "Detil",
    components:{
      DetailNavBar,
      DetailSwipper,
      DetailBaseInfo,
      Scroll,
    },
    data(){
        return {
            iid : null,
            topImages: [],
            goods: {},
        }
    },
    created(){
       // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res=>{
          
         // 1.获取顶部的图片轮播数据
        console.log(res);
        let data=res.result;
        this.topImages = data.itemInfo.topImages

         // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      })
       
    }
        
   
}
</script>

<style scoped>

</style scoped>
#detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }



</style>