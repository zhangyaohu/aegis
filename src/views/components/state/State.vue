<template>
  <div class="state" @click="$emit('handle')">
    <span class="dot" :class="_class"></span>
    <span class="text">
			<span :class="_class">{{content}}</span>
		</span>
  </div>
</template>

<script>
export default {
  name: "State",
  props: {
    content: {
      type: String,
      defualt: ""
    },
    state: {
      type: String,
      defualt: ""
		}
  },
  computed: {
    _class() {
      let _this = this, currState = _this.state.toLowerCase();
      return {
        running: currState === "handle" || currState === 'open',
        stopped: currState === "no_handle" || currState === 'close',
        run: currState === "run",
        active: currState === "active"
      };
    }
  }
};
</script>
<style lang="less" scoped>
.state {
	display: inline-block;
  .dot {
    width: 10px;
    height: 10px;
    display: inline-block;
    position: relative;
    border-radius: 50%;
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      opacity: 1;
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
    }
  }
  .running {
    background: #45bb79;
    color: #45bb79;
	}
	.stopped{
	  background: #ec5960;
		color: #ec5960;
		cursor: pointer;
	}
	.text{
		.running{
			 background: none;
     	 color: #45bb79;
		}
		.stopped{
	  	 background: none;
     	 color: #ec5960;
	  }
	}
}
</style>