<template >
  <div
    class="timer-wrapper"
    :style="{
      backgroundColor:
        direction == 'left'
          ? this.redo_color
          : direction == 'right'
          ? this.delete_color
          : '#fff',
    }"
  >
    <div class="delete-triger">
      <span>{{ del_text }}</span>
    </div>
    <div class="redo-triger">
      <span>{{ edit_text }}</span>
    </div>
    <div
      :class="[animation ? 'animation' : '', 'slide-item']"
      @touchstart="startHandler"
      @touchmove="moveHandler"
      @touchend="endHandler"
      :style="{
        transform: is_swip_x ? `translateX(${move_x}px)` : 'none',
      }"
    >
      <slot />
    </div>
  </div>
</template>
  <script>
export default {
  name: "slideItem",
  props: {
    del_text: {
      default: "Delete",
      type: String,
    },
    edit_text: {
      default: "Edit",
      type: String,
    },
    left_threshold: {
      default: 100,
      type: Number,
    },
    right_threshold: {
      default: 0,
    },
  },
  data() {
    return {
      delete_color: "#f87171",
      redo_color: "#22d3ee",
      start_x: 0,
      start_y: 0,
      move_x: 0,
      move_y: 0,
      direction: "normal", // right| left |normal
      animation: false,
      is_swip_x: false,
    };
  },
  methods: {
    startHandler(e) {
      const [touch] = e.targetTouches;
      const { clientX, clientY } = touch;
      this.start_x = clientX;
      this.start_y = clientY;
    },
    moveHandler(e) {
      // e.preventDefault();
      const [touch] = e.targetTouches;
      const { clientX, clientY } = touch;
      this.move_x =
        clientX - this.start_x > this.right_threshold
          ? this.right_threshold
          : clientX - this.start_x < -this.left_threshold
          ? -this.left_threshold
          : clientX - this.start_x;
      this.move_y = clientY - this.start_y;
      if (this.move_x > 0) {
        this.direction = "right";
      }
      if (this.move_x < 0) {
        this.direction = "left";
      }
      if (!this.is_swip_x) {
        let degrees = this.checkRadians(this.move_y, this.move_x);
        if (degrees < 20) this.is_swip_x = true;
      }
    },
    endHandler(e) {
      if (
        this.move_x >
        (this.right_threshold - 20 > 0 ? this.right_threshold - 20 : 0)
      ) {
        this.$emit("delete");
      }
      if (
        this.move_x <
        (this.left_threshold - 20 > 0 ? 20 - this.left_threshold : 0)
      ) {
        this.$emit("edit");
      }
      this.animation = true;
      (this.start_x = 0),
        (this.start_y = 0),
        (this.move_x = 0),
        (this.move_y = 0),
        (this.is_swip_x = false);
      setTimeout(() => {
        this.animation = false;
        this.direction = "normal";
      }, 300);
    },
    checkRadians(x, y) {
      var radians = Math.atan(Math.abs(x) / Math.abs(y));
      var degrees = radians * (180 / Math.PI);
      return degrees;
    },
  },
};
</script>
  <style lang="less" scoped>
.timer-wrapper {
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5) inset,
    0 4px 6px -4px rgb(0 0 0 / 0.15) inset;
  background-color: #f87171;
}
.delete-triger,
.redo-triger {
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  position: absolute;
  font-size: 14px;
  .confirm-notify {
    font-size: 12px;
    color: rgb(240, 240, 240);
  }
}
.delete-triger {
  left: 0;
}
.redo-triger {
  right: 0;
}
.slide-item {
  position: relative;
  height: 3rem;
  box-sizing: border-box;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  background-color: #282828;
  background-image: linear-gradient(
    270deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0.3)
  );
  &.animation {
    transition: 0.3s;
  }
}
</style>