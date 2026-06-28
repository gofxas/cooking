<template >
  <Transition>
    <div v-if="show_timeover" @click="close()" class="timeover">
      <div class="timeover-card">
        <p>Kitchen Timer</p>
        <span>时间到了</span>
        <div v-if="overdueTimers.length" class="overdue-list">
          <div
            class="overdue-item"
            v-for="timer in overdueTimers"
            :key="timer.id"
            :style="{ '--timer-color': timer.backgroundColor || '#82d5bb' }"
          >
            <i></i>
            <strong>{{ timer.name || "计时器" }}</strong>
            <em>已完成</em>
          </div>
        </div>
        <small>点击任意位置停止提示音</small>
      </div>
    </div>
  </Transition>
</template>
<script>
export default {
  data() {
    return {
      show_timeover: false,
      overdueTimers: [],
    };
  },
  methods: {
    open(timer) {
      if (timer && !this.overdueTimers.some((item) => item.id === timer.id)) {
        this.overdueTimers.push(timer);
      }
      if (!this.show_timeover) {
        this.show_timeover = true;
        playsound(0);
      }
    },
    close() {
      this.show_timeover = false;
      this.overdueTimers = [];
      sound.stop();
    },
  },
};
</script>
<style lang="less" scoped>
.timeover {
  position: fixed;
  inset: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  background-color: rgba(248, 248, 240, 0.72);
  backdrop-filter: blur(8px);
}
.timeover-card {
  width: min(100%, 22rem);
  min-height: 13rem;
  max-height: calc(100vh - 2.5rem);
  padding: 1.45rem 1.1rem 1.1rem;
  border-radius: 32px;
  border: 2px solid var(--border);
  background:
    radial-gradient(circle, rgba(25, 200, 185, 0.13) 1.5px, transparent 1.5px)
      0 0 / 28px 28px,
    radial-gradient(circle, rgba(255, 204, 0, 0.16) 1px, transparent 1px)
      7px 7px / 14px 14px,
    var(--surface);
  box-shadow: 0 7px 0 var(--shadow-stack), var(--shadow-soft);
  color: var(--text);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  p {
    margin: 0 0 0.45rem;
    color: var(--success);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  span {
    color: var(--text-strong);
    font-size: 2rem;
    font-weight: 900;
  }
  small {
    margin-top: 0.85rem;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 800;
  }
}
.overdue-list {
  width: calc(100% - 0.2rem);
  margin-top: 1rem;
  padding: 0.2rem 0.1rem 0.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: min(9.5rem, 36vh);
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.overdue-item {
  width: 100%;
  min-height: 2.45rem;
  padding: 0.55rem 0.75rem;
  border-radius: 16px;
  border: 1.5px solid color-mix(in srgb, var(--timer-color), var(--border) 42%);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--timer-color), transparent 80%) 1.5px, transparent 1.5px)
      0 0 / 24px 24px,
    color-mix(in srgb, var(--timer-color), #fff8e0 78%);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-strong);
  i {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--timer-color);
    box-shadow: 0 2px 0 var(--shadow-stack);
  }
  strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    font-size: 0.88rem;
    font-weight: 900;
  }
  em {
    color: var(--text-muted);
    font-size: 0.7rem;
    font-style: normal;
    font-weight: 800;
  }
}
</style>
