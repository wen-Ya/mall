<template>
    <div class="goods-item" @click="itemClick">
    <img :src="goodsItem.show.img" alt="" srcset="" @load="imgLoad">
       <div class="goods-info">
          <p>{{goodsItem.title}}</p>
          <span class="price">{{goodsItem.price}}</span>
          <span class="collect">{{goodsItem.cfav}}</span>
       </div>
   </div>
</template>

<script>
export default {
    name: "GoodsListItem",
     props: {
        goodsItem: {
            type: Object,  //list中的数据是Object类型
            default(){
                return []
            }
        }
    },
    methods: {
      imgLoad(){
         this.$bus.$emit('emitImgLoad');
      },
      itemClick(){
         this.$router.push('/detail'+'/'+this.goodsItem.iid)
      }
    }
}
</script>

<style scoped>
   .goods-item {
      width: 48%;
      padding-bottom: 40px;
      position: relative;
   }
   .goods-item img{
      width: 100%;
      border-radius: 5px;
   }
   .goods-item .goods-info{
      position: absolute;
      left: 0;
      bottom: 5px;
      right: 0px;
      font-size: 12px;
      text-align: center;
      overflow: hidden;
   
   }
   .goods-info p{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 3px;
   }
   .goods-info .price{
      color : var(--color-high-text);
      margin-right: 20px;
   } 
   .goods-info .collect{
       position: relative;
   }
   .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>