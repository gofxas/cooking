

<template>
  <div class="main">
    <header class="home-header">
      <div>
        <p class="eyebrow">Kitchen Island</p>
        <h1>厨房定时器</h1>
      </div>
      <div class="timer-count">
        <strong>{{ runningCount }}</strong>
        <span>进行中</span>
      </div>
    </header>
    <TransitionGroup name="list" class="task-list" tag="div">
      <Timer
        v-for="timer in timers"
        :timer="timer"
        :key="timer.id"
        :ding="Base.ding"
        @reload="reloadHandler"
        @delete="deleteHandler"
        @timeend="timeendHandler"
      />
      <div v-if="timers.length === 0" key="empty" class="empty-state">
        <div class="empty-demo" aria-hidden="true">
          <div class="demo-track">
            <span class="demo-action">松开创建</span>
            <div class="demo-capsule">
              <span class="demo-label">右滑创建定时器</span>
            </div>
          </div>
          <div class="demo-time">00:02:00</div>
        </div>
        <h2>拖动底部胶囊开始计时</h2>
        <p>右滑选择时间并创建，左滑进入设置。</p>
      </div>
    </TransitionGroup>
    <Creator @setting="settingHandler" @create="newTimerHandler" />
    <Timeover ref="timeover"/>
  </div>
</template>
<script>
import Creator from "./components/creator.vue";
import Timer from "./components/timer.vue";
import Timeover from "./components/timeover.vue";
import Base from "./state";
export default {
  name: "App",
  components: { Creator, Timer, Timeover },
  data() {
    return {
      Base,
      timers: [],
      timerout: null,
    };
  },
  computed: {
    runningCount() {
      return this.timers.filter((timer) => timer.rest > 0).length;
    },
  },
  methods: {
    timeendHandler(timer) {
      this.$refs.timeover.open(timer)
    },
    settingHandler() {
      this.$router.push("/setting");
    },
    newTimerHandler(object) {
      this.timers.push(object);
      this.save();
      this.$nextTick(() => {
        this.startTimer();
      });
    },
    reloadHandler() {
      this.save();
      this.$nextTick(() => {
        this.startTimer();
      });
    },
    deleteHandler(id) {
      this.timers = this.timers.filter((t) => t.id != id);
      this.save();
    },
    startTimer() {
      const now = new Date().getTime();
      this.timers = this.timers.map((item) => {
        const rest = item.start + item.duration - now;
        if (rest >= 0) {
          item.rest = rest;
        } else {
          item.rest = 0;
        }
        return item;
      });
      if (!this.timerout) {
        this.timerout = null;
        clearTimeout(this.timerout);
      }
      this.timerout = setTimeout(() => {
        const running_timers = this.timers.filter((t) => t.rest > 0);
        if (running_timers.length > 0) {
          this.startTimer();
        }
      }, 200);
    },
    save() {
      const strings = JSON.stringify(this.timers);
      localStorage.setItem("timers", strings);
    },
    read() {
      const list = JSON.parse(localStorage.getItem("timers")) || [];
      this.timers = list;
    },
  },
  mounted() {
    this.read();
    this.startTimer();
  },
};
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  max-width: 27rem;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.9rem 0.7rem;
}
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.35rem 0.15rem 0.85rem;
  flex: 0 0 auto;
  h1 {
    margin: 0;
    color: var(--text-strong);
    font-size: 1.55rem;
    line-height: 1.1;
    font-weight: 900;
    letter-spacing: 0;
  }
}
.eyebrow {
  margin: 0 0 0.15rem;
  color: var(--success);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.timer-count {
  min-width: 4.6rem;
  min-height: 3.2rem;
  padding: 0.45rem 0.75rem;
  border-radius: 18px;
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-small);
  strong {
    color: var(--text-strong);
    font-size: 1.2rem;
    line-height: 1;
    font-weight: 900;
  }
  span {
    font-size: 0.7rem;
    font-weight: 700;
  }
}
.task-list {
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
  padding: 0.15rem 0.1rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.empty-state {
  min-height: 15.5rem;
  border-radius: var(--radius-card);
  border: 2px dashed var(--border);
  background:
    radial-gradient(circle, rgba(25, 200, 185, 0.12) 1.5px, transparent 1.5px)
      0 0 / 28px 28px,
    radial-gradient(circle, rgba(255, 204, 0, 0.12) 1px, transparent 1px)
      7px 7px / 14px 14px,
    rgba(247, 243, 223, 0.88);
  color: var(--text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1.55rem 1.2rem;
  h2 {
    margin: 1rem 0 0.35rem;
    font-size: 1.05rem;
    color: var(--text-strong);
  }
  p {
    margin: 0;
    max-width: 14rem;
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.6;
  }
}
.empty-demo {
  width: 100%;
  max-width: 17rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}
.demo-track {
  position: relative;
  width: 100%;
  height: 3.35rem;
  overflow: hidden;
  border-radius: 24px;
  border: 2px solid rgba(114, 93, 66, 0.12);
  background: linear-gradient(135deg, var(--primary) 0%, #82d5bb 55%, #6fba2c 100%);
  box-shadow: inset 0 3px 8px rgba(114, 93, 66, 0.16);
}
.demo-action {
  height: 100%;
  padding-left: 1rem;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 900;
}
.demo-capsule {
  position: absolute;
  inset: 0;
  border-radius: 22px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  animation: demo-drag-capsule 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.demo-label {
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}
.demo-time {
  min-width: 7.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border);
  background: rgba(255, 248, 224, 0.86);
  color: var(--text-strong);
  box-shadow: 0 4px 0 var(--shadow-stack);
  font-size: 1.15rem;
  line-height: 1;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  animation: demo-time-pop 2.8s ease-in-out infinite;
}
@keyframes demo-drag-capsule {
  0%,
  14% {
    transform: translateX(0);
  }
  48%,
  66% {
    transform: translateX(72%);
  }
  82%,
  100% {
    transform: translateX(0);
  }
}
@keyframes demo-time-pop {
  0%,
  18%,
  86%,
  100% {
    opacity: 0.55;
    transform: translateY(0) scale(0.96);
  }
  48%,
  68% {
    opacity: 1;
    transform: translateY(-0.08rem) scale(1);
  }
}
.item {
  padding: 2rem;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.7);
}
</style>
