<template>
  <div class="loading-container" :class="{'cover': cover}">
		<div class="loading-box">
      <span></span>
    </div>
	</div>
</template>

<script>
export default {
	name: 'Loading',
	props: {
		cover: {
			type: Boolean,
			default: false
		}
	}
};
</script>

<style lang="less" scoped>
.loading-box{
  	display: inline-block;
    width: 30px;
    height: 30px;
    box-sizing: border-box;
    border-radius: 50%;
    border-top: 10px solid #3888fa;
    position:relative;
    animation: a1 2s linear infinite;  //动画名为a1，在下面定义
    //设置圆角再设置边框就会有弧线的效果
}
.loading-box:before,.loading-box:after{
    content: '';
    width: 30px;
    height: 30px;
    position: absolute;
    left: 0;
    top: -10px;   //反复调节得到的数值
    box-sizing: border-box;
    border-radius: 50%;
  //在盒子的左边加两个伪类元素
}
 .loading-box:before{
    border-top:10px solid #e67e22;
    transform: rotate(120deg);  //让其中一个伪类元素旋转至右边
}
 .loading-box:after{
    border-top:10px solid #ff005a;
    transform: rotate(240deg);  //旋转至左边
}
 .loading-box span{
    position: absolute;
    width: 30px;
    height: 30px;
    color: #000;
    font-size: 15px;
    text-align: center;
    line-height: 30px;
    animation: a2 2s linear infinite;
    //给文字也定义一个动画
}
//让盒子旋转起来
  @keyframes a1 {
    to{
      transform: rotate(360deg)
    }
  }
//让文字反方向旋转，实现文字不动的效果
 @keyframes a2 {
    to{
      transform: rotate(-360deg)
    }
	}
	.loading-container{
		width: 100%;
		text-align: center;
		vertical-align: middle;
		height:100%;
	}
	.cover{
		background: #fff;
		opacity: .5;
	}
</style>