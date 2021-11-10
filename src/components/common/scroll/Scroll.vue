<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    
    props: {
    
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    
    },
   
    data() {
      return {
        scroll: null,
        message: '哈哈哈'
      }
    },
    //挂载
    mounted() {
      // 1.创建BScroll对象
      //当mounted挂载时，建创建BScroll
        // this.scroll = new BScroll(document.querySelector('.content'))  不使用document.querySelector('.content') 去获取.content的原因：
        //当有多个content类名时，不确定获取的是哪个类
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      /*if(this.probeType ===2 || this.probeType === 3){}提高性能*/
      if(this.probeType ===2 || this.probeType === 3){
         this.scroll.on('scroll', (position) => {
        // console.log(position);
        this.$emit('scroll', position)
      })
      }
       // 3.监听上拉事件
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
       console.log(this.scroll);
    },
    methods: {
      scrollTo(x, y, time=300) {
       this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
       this.scroll && this.scroll.finishPullUp()
      },
      refresh(){
       this.scroll && this.scroll.refresh()
      },
       getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
