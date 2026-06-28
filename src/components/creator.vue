<template >
  <div :class="['creator-wrapper', direction]">
    <Transition>
      <div
        v-if="show_detail_panel"
        :style="{
          ['--color']: color || '#fff',
          color: color || '#fff',
        }"
        class="creator-detail"
      >
        <p class="detail-kicker">松开后创建</p>
        <h1>{{ format_time || "00:00:00" }}</h1>
        <div class="types">
          <span
            v-for="(name, index) in Base.types"
            :key="index"
            :class="this.name === name ? 'active' : ''"
            @click="this.name = name"
            >{{ name }}</span
          >
        </div>
        <p class="countdown" v-if="auto_creator">
          {{ auto_count_out }} 秒后加入计时
        </p>
        <button class="detail-close" type="button" @click.stop="closeDetail">
          收起弹窗
        </button>
      </div>
    </Transition>

    <div class="triger triger1">
      <span>松开创建</span>
    </div>
    <div class="triger triger2">
      <span>设置</span>
    </div>
    <div
      :class="[animation ? 'animation' : '', 'creator-main']"
      @touchstart="startHandler"
      @touchmove="moveHandler"
      @touchend="endHandler"
      :style="{
        transform: is_swip_x ? `translateX(${move_x}px)` : 'none',
      }"
    >
      <span class="slider-label">右滑创建定时器</span>
      <span v-if="direction !== 'right'" class="slider-hint">左滑设置</span>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import colors from "../colors";
import Base from "../state";
dayjs.extend(duration);
export default {
  name: "creator",
  data() {
    return {
      Base,
      start_x: 0,
      start_y: 0,
      move_x: 0,
      move_y: 0,
      direction: "normal", // right| left |normal
      animation: false,
      is_swip_x: false,
      show_detail_panel: false,
      auto_creator: null,
      auto_count_out: 0,
      format_time: "",
      time: 0,
      color: "",
      name: Base.types[0],
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
      e.preventDefault();
      if (this.auto_creator) {
        return;
      }
      let minMove = this.direction == "right" ? 0 : -100;
      const maxWidth = window.innerWidth;
      const [touch] = e.targetTouches;
      const { clientX, clientY } = touch;
      this.move_x =
        clientX - this.start_x >= maxWidth
          ? maxWidth
          : clientX - this.start_x < minMove
          ? minMove
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
        if (degrees < 20) {
          this.is_swip_x = true;
          if (this.direction == "right") {
            this.show_detail_panel = true; // show detail
            this.randomColor();
          }
        }
      }
      this.slidetimes();
    },
    endHandler(e) {
      setTimeout(() => {
        this.animation = false;
        this.direction = "normal";
      }, 300);
      if (this.direction == "left" && this.move_x < -80) {
        this.$emit("setting");
      }

      this.animation = true;
      (this.start_x = 0),
        (this.start_y = 0),
        (this.move_x = 0),
        (this.move_y = 0),
        (this.is_swip_x = false);
      if (this.auto_creator) {
        return;
      } else {
        if (this.direction == "right") {
          this.auto_count_out = this.time >= 4 ? 4 : this.time;
          if (this.auto_count_out > 0 && this.show_detail_panel) {
            this.auto_creator = setInterval(() => {
              this.auto_count_out -= 1;
              this.time -= 1000;
              this.resetTime(this.time);
              if (this.auto_count_out <= 0) {
                clearInterval(this.auto_creator);
                this.createTimer();
              }
            }, 1000);
          } else {
            clearInterval(this.auto_creator);
            this.resetCreator();
          }
        }
        if (this.direction == "left") {
          this.resetCreator();
        }
      }
    },
    checkRadians(x, y) {
      var radians = Math.atan(Math.abs(x) / Math.abs(y));
      var degrees = radians * (180 / Math.PI);
      return degrees;
    },
    closeDetail() {
      if (this.auto_creator) {
        clearInterval(this.auto_creator);
        this.auto_creator = null;
      }
      if (this.time > 0) {
        this.createTimer();
      } else {
        this.resetCreator();
      }
      this.start_x = 0;
      this.start_y = 0;
      this.move_x = 0;
      this.move_y = 0;
      this.direction = "normal";
      this.animation = true;
      this.is_swip_x = false;
      setTimeout(() => {
        this.animation = false;
      }, 300);
    },
    randomColor() {
      var randomIndex = Math.floor(Math.random() * colors.length);
      this.color = colors[randomIndex];
    },
    resetTime(t) {
      const d = dayjs.duration(t);
      const h =
        Math.floor(d.asHours()) < 10
          ? "0" + Math.floor(d.asHours())
          : Math.floor(d.asHours());
      const m = d.minutes() < 10 ? "0" + d.minutes() : d.minutes();
      const s = d.seconds() < 10 ? "0" + d.seconds() : d.seconds();
      //   const ms = d.milliseconds();
      this.format_time = `${h}:${m}:${s}`;
    },
    slidetimes() {
      let x = this.move_x;
      if (x <= 0) {
        return;
      }
      if (x <= 60) {
        this.time = Math.floor(x / 5) * 5 * 1000;
      } else if (x <= 120 && x > 60) {
        let rx = x - 60;
        this.time = (Math.floor(rx / 10) * 30 + 60) * 1000;
      } else if (x <= 180 && x > 120) {
        let rx = x - 120;
        this.time = (Math.floor(rx / 10) * 60 + 6 * 30 + 60) * 1000;
      } else {
        let rx = x - 180;
        this.time =
          (Math.floor(rx / 10) * 60 * 5 + 6 * 60 + 6 * 30 + 60) * 1000;
      }
      this.resetTime(this.time);
    },
    createTimer() {
      const auto_creator_time = 5000;
      const timer_instance = {
        start: new Date().getTime() - auto_creator_time,
        duration: this.time + auto_creator_time,
        rest: 0,
        name: this.name,
        backgroundColor: this.color,
        id: Math.random().toString(32).substr(2, 6),
      };
      if (this.time >= 0) {
        this.$emit("create", timer_instance);
      }
      this.resetCreator();
    },
    resetCreator() {
      this.auto_creator = null;
      this.show_detail_panel = false;
      this.time = 0;
      this.format_time = "";
      this.name = Base.types[0];
    },
  },
};
</script>
<style lang="less" scoped>
.creator-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: var(--creator-height);
  flex: 0 0 var(--creator-height);
  border-radius: 26px;
  background: var(--surface-soft);
  border: 2px solid rgba(114, 93, 66, 0.12);
  box-shadow: inset 0 3px 8px rgba(114, 93, 66, 0.16);
  box-sizing: border-box;
  &.right {
    background: linear-gradient(90deg, #19c8b9 0%, #39d7c2 45%, #86d67a 100%);
  }
  &.left {
    background: linear-gradient(135deg, #ffcc00 0%, #f7cd67 55%, #e59266 100%);
  }
}
.creator-main {
  position: relative;
  height: var(--creator-height);
  box-sizing: border-box;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  border-radius: 24px;
  border: 2px solid #f8f8f0;
  color: var(--text-strong);
  background:
    repeating-linear-gradient(
      -45deg,
      rgba(25, 200, 185, 0.12),
      rgba(25, 200, 185, 0.12) 10px,
      rgba(255, 204, 0, 0.14) 10px,
      rgba(255, 204, 0, 0.14) 20px
    ),
    var(--surface-strong);
  box-shadow: 0 5px 0 var(--shadow-stack);
  font-size: 0.86rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  touch-action: pan-y;
  &.animation {
    transition: transform var(--motion);
  }
}
.slider-hint {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 800;
}
.slider-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.creator-detail {
  width: min(calc(100vw - 32px), 360px);
  min-height: 11.5rem;
  max-height: calc(100dvh - 32px);
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.9rem;
  border-radius: 24px;
  border: 2px solid color-mix(in srgb, var(--color), var(--border) 45%);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--color), transparent 82%) 1.5px, transparent 1.5px)
      0 0 / 28px 28px,
    radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
      7px 7px / 14px 14px,
    rgba(248, 248, 240, 0.92);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(6px);
  h1 {
    margin: 0.1rem 0 0.75rem;
    color: var(--text-strong);
    font-size: clamp(1.8rem, 9vw, 2.85rem);
    line-height: 1;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }
}
.detail-close {
  margin-top: 0.85rem;
  min-width: 6rem;
  height: 2rem;
  padding: 0 0.9rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-pill);
  background: rgba(255, 248, 224, 0.88);
  color: var(--text-strong);
  box-shadow: 0 3px 0 var(--shadow-stack);
  font-size: 0.75rem;
  line-height: 1;
  font-weight: 900;
  cursor: pointer;
  &:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 var(--shadow-stack);
  }
}
.detail-kicker,
.countdown {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 900;
}
.countdown {
  margin-top: 0.85rem;
  color: var(--text-strong);
}
.types {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: center;
  span {
    min-width: 3.1rem;
    height: 1.9rem;
    padding: 0 0.65rem;
    line-height: 1.7rem;
    text-align: center;
    border-radius: var(--radius-pill);
    border: 2px solid color-mix(in srgb, var(--color), var(--border) 35%);
    background: rgba(255, 255, 255, 0.48);
    color: var(--text);
    font-size: 0.74rem;
    font-weight: 900;
    transition: var(--motion);
    &:hover,
    &.active {
      color: #fff;
      background-color: var(--color);
      border-color: var(--color);
      box-shadow: 0 4px 0 color-mix(in srgb, var(--color), #6d553b 30%);
      transform: translateY(-1px);
    }
  }
}
.triger {
  height: var(--creator-height);
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
  &.triger1 {
    left: 0;
    width: 100%;
    align-items: flex-start;
    background: linear-gradient(90deg, #19c8b9 0%, #39d7c2 45%, #86d67a 100%);
  }
  &.triger2 {
    right: 0;
    width: 7.5rem;
    align-items: flex-end;
    color: var(--text-strong);
    background: linear-gradient(135deg, #ffcc00 0%, #f7cd67 55%, #e59266 100%);
    transition: opacity var(--motion);
  }
}
.creator-wrapper.right .triger2 {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 0.4rem));
}
</style>
