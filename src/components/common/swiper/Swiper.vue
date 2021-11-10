<template>
    <div id="hy-swiper">
      <div class="swiper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <slot></slot>
      </div>
      <slot name="indicator">
      </slot>
      <div class="indicator">
        <slot name="indicator" v-if="showIndicator && slideCount>1">
          <div v-for="(item, index) in slideCount" class="indi-item" :class="{active: index===currentIndex-1}" :key="index"></div>
        </slot>
      </div>
    </div>
</template>

<script>
	export default {
		name: "Swiper",
    props: {
      interval: {   
		    type: Number,
        default: 3000
      },
      animDuration: { 
		    type: Number,
        default: 300
      },
      moveRatio: {  
        type: Number,
        default: 0.25
      },
      showIndicator: { 
        type: Boolean,
        default: true 
      }
    },
    data: function () {
		  return {
        slideCount: 0, // 元素个数
        totalWidth: 0, // swiper的宽度
        swiperStyle: {}, // swiper样式
        currentIndex: 1, // 当前的index
        scrolling: false, // 是否正在滚动
      }
    },
    
    /* 
      生命函数 mounted
      编译好的HTML挂载到页面完成后执行的事件钩子
      此钩子函数一般做一些ajax请求获取数据进行数据初始化
      只执行一次
    */ 
    mounted: function () {
      // 1.操作DOM, 在前后添加Slide
      setTimeout(() => {
        this.handleDom();

        // 2.开启定时器
        this.startTimer();
      }, 100)
    },
    methods: {
		  /**
       * 定时器操作
       */
      startTimer: function () {
		    this.playTimer = window.setInterval(() => {
		      this.currentIndex++;
		      this.scrollContent(-this.currentIndex * this.totalWidth);
        }, this.interval)
      },
      stopTimer: function () {
        window.clearInterval(this.playTimer);
      },

      /**
       * 滚动到正确的位置
       */
      scrollContent: function (currentPosition) {
        // 0.设置正在滚动
        this.scrolling = true;

        // 1.开始滚动动画
        this.swiperStyle.transition ='transform '+ this.animDuration + 'ms';
        this.setTransform(currentPosition);

        // 2.判断滚动到的位置
        this.checkPosition();

        // 4.滚动完成
        this.scrolling = false
      },

      /**
       * 校验正确的位置
       */
      checkPosition: function () {
        window.setTimeout(() => {
          // 1.校验正确的位置
          this.swiperStyle.transition = '0ms';
          if (this.currentIndex >= this.slideCount + 1) {
            this.currentIndex = 1;
            this.setTransform(-this.currentIndex * this.totalWidth);
          } else if (this.currentIndex <= 0) {
            this.currentIndex = this.slideCount;
            this.setTransform(-this.currentIndex * this.totalWidth);
          }

          // 2.结束移动后的回调
          this.$emit('transitionEnd', this.currentIndex-1);
        }, this.animDuration)
      },

      /**
       * 设置滚动的位置
       */
      setTransform: function (position) {
      /*
         transform 属性向元素应用 2D 或 3D 转换。该属性允许我们对元素进行旋转、缩放、移动或倾斜。

        */
        //translate3d(x,y,z)  定义 3D 转换。
        this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
        this.swiperStyle['-webkit-transform'] = `translate3d(${position}px), 0, 0`;
        this.swiperStyle['-ms-transform'] = `translate3d(${position}px), 0, 0`;
      },

      /**
       * 操作DOM, 在DOM前后添加Slide
       */
		  handleDom: function () {
        // 1.获取要操作的元素
        let swiperEl = document.querySelector('.swiper');
        let slidesEls = swiperEl.getElementsByClassName('slide');

        // 2.保存个数
        this.slideCount = slidesEls.length;

        // 3.如果大于1个, 那么在前后分别添加一个slide
        if (this.slideCount > 1) {
           //克隆节点
          let cloneFirst = slidesEls[0].cloneNode(true);
          let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);

          /*
           Node.insertBefore() 方法在参考节点之前插入一个拥有指定父节点的子节点。
           语法：var insertedNode = parentNode.insertBefore(newNode, referenceNode);
           参数：insertedNode 被插入节点(newNode)
                parentNode 新插入节点的父节点
                newNode 用于插入的节点
                referenceNode newNode 将要插在这个节点之前
          */
          swiperEl.insertBefore(cloneLast, slidesEls[0]); //将cloneLast插到slidesEls[0]之后
          swiperEl.appendChild(cloneFirst);  //要追加给父节点（通常为一个元素）的节点。
          this.totalWidth = swiperEl.offsetWidth;
          this.swiperStyle = swiperEl.style;
        }

        // 4.让swiper元素, 显示第一个(目前是显示前面添加的最后一个元素)
        this.setTransform(-this.totalWidth);
      },

      /**
       * 拖动事件的处理
       */
      touchStart: function (e) {
        // 1.如果正在滚动, 不可以拖动
        if (this.scrolling) return;

        // 2.停止定时器
        this.stopTimer();

        // 3.保存开始滚动的位置
        this.startX = e.touches[0].pageX;  // pageX返回的相对于整个文档的x（水平）坐标以像素为单位的只读属性。
      },

      touchMove: function (e) {
        // 1.计算出用户拖动的距离
        this.currentX = e.touches[0].pageX;
        this.distance = this.currentX - this.startX;
        let currentPosition = -this.currentIndex * this.totalWidth;
        let moveDistance = this.distance + currentPosition;

        // 2.设置当前的位置
        this.setTransform(moveDistance);
      },

      touchEnd: function (e) {
        // 1.获取移动的距离
        let currentMove = Math.abs(this.distance); //abs() 返回绝对值

        // 2.判断最终的距离
        if (this.distance === 0) {
          return
        } else if (this.distance > 0 && currentMove > this.totalWidth * this.moveRatio) { // 右边移动超过0.5
          this.currentIndex--
        } else if (this.distance < 0 && currentMove > this.totalWidth * this.moveRatio) { // 向左移动超过0.5
          this.currentIndex++
        }

        // 3.移动到正确的位置
        this.scrollContent(-this.currentIndex * this.totalWidth);

        // 4.移动完成后重新开启定时器
        this.startTimer();
      },

      /**
       * 控制上一个, 下一个
       */
      previous: function () {
        this.changeItem(-1);
      },

      next: function () {
        this.changeItem(1);
      },

      changeItem: function (num) {
        // 1.移除定时器
        this.stopTimer();

        // 2.修改index和位置
        this.currentIndex += num;
        this.scrollContent(-this.currentIndex * this.totalWidth);

        // 3.添加定时器
        this.startTimer();
      }
    }
	}
</script>

<style scoped>
  #hy-swiper {
    overflow: hidden;
    position: relative;
  }

  .swiper {
    display: flex;
  }

  .indicator {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    bottom: 8px;
  }

  .indi-item {
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #fff;
    line-height: 8px;
    text-align: center;
    font-size: 12px;
    margin: 0 5px;
  }

  .indi-item.active {
    background-color: rgba(212,62,46,1.0);
  }
</style>
