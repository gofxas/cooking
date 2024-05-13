

<template>
  <div class="main">
    <TransitionGroup name="list" class="task-list" tag="div">
      <Timer
        v-for="timer in timers"
        :timer="timer"
        :key="timer.id"
        :ding="Base.ding"
        @reload="reloadHandler"
        @delete="deleteHandler"
      />
    </TransitionGroup>
    <Creator @setting="settingHandler" @create="newTimerHandler" />
  </div>
</template>
<script>
import Creator from "./components/creator.vue";
import Timer from "./components/timer.vue";
import Base from "./state";
export default {
  name: "App",
  components: { Creator, Timer },
  data() {
    return {
      Base,
      timers: [],
      timerout: null,
    };
  },
  computed: {},
  methods: {
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
<style scoped lang="less">
.main {
  width: 100%;
  height: calc(100%);
  max-width: 22.5rem;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.task-list {
  height: calc(100% - var(--creator-height));
  overflow: auto;
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
