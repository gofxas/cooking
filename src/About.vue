<template>
  <div class="page">
    <header>
      <p>Kitchen Island</p>
      <h1>滑动创建你的厨房定时器</h1>
      <span>移动端体验最好，桌面浏览器可用于预览。</span>
    </header>
    <video src="/about/out.webm" controls></video>
    <button @click="start">开始计时</button>
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
  width: 100%;
  min-height: 100%;
  max-width: 27rem;
  margin: 0 auto;
  padding: 1rem 0.9rem 1.5rem;
  background: transparent;
  color: var(--text);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  header {
    padding: 0.35rem 0.15rem 0.2rem;
  }
  video {
    width: 100%;
    border-radius: 24px;
    min-height: 24rem;
    max-height: 62vh;
    object-fit: cover;
    border: 2px solid var(--border);
    background: var(--surface);
    box-shadow: 0 6px 0 var(--shadow-stack), var(--shadow-small);
  }
  p {
    margin: 0 0 0.2rem;
    color: var(--success);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  h1 {
    margin: 0;
    color: var(--text-strong);
    font-size: 1.45rem;
    line-height: 1.2;
    font-weight: 900;
  }
  span {
    display: block;
    margin-top: 0.45rem;
    color: var(--text-muted);
    font-size: 0.82rem;
    font-weight: 700;
  }
  button {
    min-height: 3rem;
    padding: 0 1.2rem;
    width: 100%;
    border: 2px solid #f8f8f0;
    border-radius: var(--radius-pill);
    background: var(--surface-strong);
    color: var(--text-strong);
    box-shadow: 0 5px 0 var(--shadow-stack);
    font-size: 0.95rem;
    font-weight: 900;
    letter-spacing: 0.02em;
    transition: var(--motion);
    &:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 var(--shadow-stack);
    }
  }
}
</style>
