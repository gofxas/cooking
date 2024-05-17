<template>
  <div class="page">
    <p>操作视频</p>
    <p>pc端不能使用</p>
    <video src="/about/out.webm" controls></video>
    <button @click="start">立即开始！</button>
  </div>
</template>
<script>
export default {
  name: "about",
  methods: {
    start() {
      localStorage.setItem("visited", true);
      this.$router.replace("/");
    },
  },
};
</script>
<style lang="less" scoped>
.page {
  padding: 10px;
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
  video {
    width: 100%;
    border-radius: 6px;
    height: 400px;
  }
  p {
    color: #333;
  }
  button {
    padding: 5px 10px;
    width: 100%;
  }
}
</style>