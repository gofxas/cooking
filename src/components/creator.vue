<template >
  <div class="creator-wrapper">
    <Transition>
      <div
        v-if="show_detail_panel"
        :style="{
          ['--color']: color || '#fff',
          color: color || '#fff',
        }"
        class="creator-detail"
      >
        <h1>{{ format_time }}</h1>
        <div class="types">
          <span
            v-for="(name, index) in Base.types"
            :key="index"
            :class="this.name === name ? 'active' : ''"
            @click="this.name = name"
            >{{ name }}</span
          >
        </div>
      </div>
    </Transition>

    <div class="triger triger1">
      <span>松开创建</span>
    </div>
    <div class="triger triger2">
      <span>松开设置</span>
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
      拖动创建定时器
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
                this.timeoutCreateTimer();
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
    timeoutCreateTimer() {
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
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5) inset,
    0 4px 6px -4px rgb(0 0 0 / 0.15) inset;
  box-sizing: border-box;
}
.creator-main {
  position: relative;
  height: var(--creator-height);
  box-sizing: border-box;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  //   transition: 0.3s;
  background-color: #282828;
  background-image: linear-gradient(
    270deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0.3)
  );
  font-size: 0.7rem;
  &.animation {
    transition: 0.3s;
  }
}
.creator-detail {
  width: 100%;
  height: calc(100% - var(--creator-height));
  position: fixed;
  top: 0;
  z-index: 9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #dbdbdba3;
  backdrop-filter: blur(1px);
  //   background-color: #fff;
}
.types {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  justify-content: center;
  span {
    width: 4rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border: 1px solid var(--color);
    &:hover,
    &.active {
      color: #fff;
      background-color: var(--color);
    }
  }
}
.triger {
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  position: absolute;
  font-size: 14px;
  &.triger1 {
    left: 0;
  }
  &.triger2 {
    right: 0;
  }
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>