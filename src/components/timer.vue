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
      <span>删除</span>
      <span class="confirm-notify" v-if="confirm_notify">（松开确认）</span>
    </div>
    <div class="redo-triger">
      <span>重新开始</span>
      <span class="confirm-notify" v-if="confirm_notify">（松开确认）</span>
    </div>
    <div
      :class="[animation ? 'animation' : '', 'timer-item']"
      @touchstart="startHandler"
      @touchmove="moveHandler"
      @touchend="endHandler"
      :style="{
        backgroundColor: timer.backgroundColor,
        transform: is_swip_x ? `translateX(${move_x}px)` : 'none',
      }"
    >
      <span>{{ timer.name }}</span>
      <span>{{ rest }}</span>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
export default {
  name: "timer",
  props: {
    ding: {
      default: true,
      type: Boolean,
    },
    timer: {
      default: () => ({
        start: Number,
        duration: Number,
        name: String,
        id: String,
      }),
      type: Object,
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
      confirm_notify: false,
      n: 0,
    };
  },
  watch: {
    timer: {
      handler(n, o) {
        if (n.rest == 0 && n.rest != this.n && this.ding) {
          // playsound();
          this.$emit("timeend");
        }
        this.n = n.rest;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    rest() {
      const d = dayjs.duration(this.timer.rest);
      const h =
        Math.floor(d.asHours()) < 10
          ? "0" + Math.floor(d.asHours())
          : Math.floor(d.asHours());
      const m = d.minutes() < 10 ? "0" + d.minutes() : d.minutes();
      const s = d.seconds() < 10 ? "0" + d.seconds() : d.seconds();
      //   const ms = d.milliseconds();
      return `${h}:${m}:${s}`;
    },
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
        clientX - this.start_x > 180
          ? 180
          : clientX - this.start_x < -180
          ? -180
          : clientX - this.start_x;
      this.move_y = clientY - this.start_y;
      if (Math.abs(this.move_x) > 100) {
        this.confirm_notify = true;
      }
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
      if (this.move_x > 100) {
        // todo  delete
        console.log("delete");
        this.$emit("delete", this.timer.id);
      }
      if (this.move_x < -100) {
        // todo  redo
        this.timer.start = new Date().getTime();
        this.$emit("reload");
      }
      this.animation = true;
      (this.start_x = 0),
        (this.start_y = 0),
        (this.move_x = 0),
        (this.move_y = 0),
        (this.is_swip_x = false),
        (this.confirm_notify = false);
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
.timer-item {
  position: relative;
  height: 3rem;
  box-sizing: border-box;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  //   transition: 0.3s;
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