<template >
  <div
    :class="['timer-wrapper', direction]"
  >
    <div class="delete-triger action-triger">
      <span>{{ del_text }}</span>
    </div>
    <div class="redo-triger action-triger">
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
  min-height: 3.8rem;
  border-radius: 20px;
  background: var(--surface-soft);
  border: 2px solid rgba(114, 93, 66, 0.1);
  box-shadow: inset 0 3px 8px rgba(114, 93, 66, 0.14);
  &.right {
    background: linear-gradient(135deg, var(--danger) 0%, #fc736d 100%);
  }
  &.left {
    background: linear-gradient(135deg, var(--primary) 0%, #82d5bb 60%, #6fba2c 100%);
  }
}
.action-triger {
  height: 100%;
  min-height: 3.8rem;
  width: 6.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1.05rem;
  position: absolute;
  top: 0;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}
.delete-triger {
  left: 0;
  align-items: flex-start;
  background: linear-gradient(135deg, var(--danger) 0%, #fc736d 100%);
}
.redo-triger {
  right: 0;
  width: 7.8rem;
  align-items: flex-end;
  color: var(--text-strong);
  background: linear-gradient(135deg, #ffcc00 0%, #f7cd67 52%, var(--primary) 100%);
}
.slide-item {
  position: relative;
  min-height: 3.8rem;
  box-sizing: border-box;
  padding: 0 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  border-radius: 18px;
  color: var(--text);
  background:
    radial-gradient(circle, rgba(196, 184, 158, 0.15) 1.5px, transparent 1.5px)
      0 0 / 28px 28px,
    radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px)
      7px 7px / 14px 14px,
    var(--surface);
  box-shadow: 0 4px 0 var(--shadow-stack), var(--shadow-small);
  font-size: 0.9rem;
  font-weight: 800;
  touch-action: pan-y;
  &.animation {
    transition: transform var(--motion);
  }
}
</style>
