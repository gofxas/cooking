<template >
  <router-view v-slot="{ Component }">
    <transition name="fade-in" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>
<script>
export default {};
</script>
<style lang="less">
.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
  -webkit-transition: opacity 0.2s linear;
  transition: opacity 0.2s linear;
}
.fade-in-linear-enter,
.fade-in-linear-leave,
.fade-in-linear-leave-active {
  opacity: 0;
}
.fade-in-enter-active,
.fade-in-leave-active {
  -webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.fade-in-enter,
.fade-in-leave-active {
  opacity: 0;
}
</style>