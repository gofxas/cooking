<template >
  <Transition>
    <div v-if="show_timeover" @click="close()" class="timeover">
      <span>时间到了</span>
    </div>
  </Transition>
</template>
<script>
export default {
  data() {
    return {
      show_timeover: false,
    };
  },
  methods: {
    open() {
      if (!this.show_timeover) {
        this.show_timeover = true;
        playsound(0);
      }
    },
    close() {
      this.show_timeover = false;
      sound.stop();
    },
  },
};
</script>
<style lang="less" scoped>
.timeover {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #dbdbdba3;
  backdrop-filter: blur(1px);
}
</style>