<template >
  <div
    :class="['timer-wrapper', direction, confirm_notify ? 'is-confirm' : '']"
  >
    <div class="delete-triger action-triger">
      <span>删除</span>
      <span class="confirm-notify" v-if="confirm_notify">（松开确认）</span>
    </div>
    <div class="redo-triger action-triger">
      <span>重新开始</span>
      <span class="confirm-notify" v-if="confirm_notify">（松开确认）</span>
    </div>
    <div
      :class="[animation ? 'animation' : '', 'timer-item']"
      @touchstart="startHandler"
      @touchmove="moveHandler"
      @touchend="endHandler"
      :style="{
        '--timer-color': timer.backgroundColor,
        transform: is_swip_x ? `translateX(${move_x}px)` : 'none',
      }"
    >
      <div class="timer-meta">
        <span class="timer-name">{{ timer.name }}</span>
        <span class="timer-state">{{ timer.rest > 0 ? "正在加热" : "可以出锅" }}</span>
      </div>
      <div class="timer-time">{{ rest }}</div>
      <div class="progress-track">
        <span class="progress-fill" :style="{ width: `${progress}%` }"></span>
      </div>
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
          this.$emit("timeend", { ...this.timer });
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
    progress() {
      if (!this.timer.duration) return 0;
      const used = this.timer.duration - this.timer.rest;
      return Math.max(0, Math.min(100, (used / this.timer.duration) * 100));
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
      this.confirm_notify = Math.abs(this.move_x) > 100;
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
  border-radius: var(--radius-card);
  background: var(--surface-soft);
  min-height: 5.8rem;
  box-shadow: inset 0 3px 8px rgba(114, 93, 66, 0.14);
  flex: 0 0 auto;
  &.right {
    background: var(--danger);
  }
  &.left {
    background: var(--primary);
  }
  &.is-confirm {
    box-shadow:
      inset 0 4px 12px rgba(61, 52, 40, 0.22),
      0 0 0 2px rgba(255, 204, 0, 0.32);
  }
}
.action-triger {
  height: 100%;
  min-height: 5.8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1.05rem;
  position: absolute;
  top: 0;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  .confirm-notify {
    margin-top: 0.15rem;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.82);
    font-weight: 700;
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
  min-height: 5.8rem;
  box-sizing: border-box;
  padding: 0.85rem 0.95rem 0.75rem;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  column-gap: 0.8rem;
  row-gap: 0.55rem;
  align-items: center;
  z-index: 1;
  color: var(--text);
  border: 2px solid rgba(114, 93, 66, 0.08);
  border-radius: var(--radius-card);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--timer-color), transparent 78%) 1.5px, transparent 1.5px)
      0 0 / 28px 28px,
    radial-gradient(circle, rgba(255, 255, 255, 0.22) 1px, transparent 1px)
      7px 7px / 14px 14px,
    color-mix(in srgb, var(--timer-color), #fff8e0 72%);
  box-shadow: 0 5px 0 var(--shadow-stack), var(--shadow-small);
  touch-action: pan-y;
  &.animation {
    transition: transform var(--motion);
  }
}
.timer-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.timer-name {
  color: var(--text-strong);
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.timer-state {
  margin-top: 0.3rem;
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 800;
}
.timer-time {
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
  font-size: 1.6rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0.02em;
}
.progress-track {
  grid-column: 1 / -1;
  height: 0.52rem;
  overflow: hidden;
  border-radius: var(--radius-pill);
  border: 1.5px solid rgba(114, 93, 66, 0.12);
  background: rgba(255, 255, 255, 0.42);
}
.progress-fill {
  display: block;
  height: 100%;
  min-width: 0.25rem;
  border-radius: inherit;
  background: repeating-linear-gradient(
    -45deg,
    var(--primary),
    var(--primary) 10px,
    var(--primary-active) 10px,
    var(--primary-active) 20px
  );
  transition: width 0.2s linear;
}
</style>
