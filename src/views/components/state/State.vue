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