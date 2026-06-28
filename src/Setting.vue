<template >
  <div class="setting-page">
    <header class="setting-header">
      <p class="eyebrow">Kitchen Settings</p>
      <h1>厨房偏好</h1>
    </header>

    <section class="setting-section">
      <p class="p-title">常用标签</p>
      <p class="sub-title">最多创建 8 个，右滑删除，左滑编辑。</p>
      <div class="types">
      <SlideItem
        :right_threshold="100"
        @delete="deleteHandler(index)"
        @edit="editHandler(index)"
        v-for="(t, index) in Base.types"
        :key="index"
        del_text="删除"
        :edit_text="edit != index ? '编辑' : '保存'"
      >
        <div v-if="edit != index">
          {{ t }}
        </div>
        <input
          class="editor"
          ref="editor"
          :value="t"
          @input="inputHandler($event, index)"
          @keyup.enter="edit = -1"
          v-else
          type="text"
          autofocus
        />
      </SlideItem>
      </div>
    </section>
    <template v-if="Base.types.length < 8">
      <section class="setting-section">
      <p class="p-title">创建新标签</p>
      <SlideItem @edit="newEditHandler" :right_threshold="0" edit_text="创建">
        <input
          class="editor"
          ref="editor"
          :value="text"
          @input="newHandler($event)"
          @keyup.enter="newEditHandler"
          v-if="isNew"
          type="text"
          autofocus
        />
        <div class="row-label" v-else>
          左划创建
        </div>
      </SlideItem>
      </section>
    </template>
    <section class="setting-section">
    <p class="p-title">提示音</p>
    <p class="sub-title">左滑试听 Sentimientos 5 秒，右滑关闭。</p>
    <SlideItem
      @edit="switchDing"
      @delete="Base.ding = false"
      :right_threshold="100"
      del_text="关闭"
      edit_text="试听"
    >
      <div class="row-label">
        {{ Base.ding ? "Sentimientos 已开启" : "提示音已关闭" }}
      </div>
    </SlideItem>
    </section>
    <section class="setting-section">
    <p class="p-title">首页</p>
    <SlideItem @edit="goHome" :right_threshold="0" edit_text="回到首页">
      <div class="row-label">
        左划回首页
      </div>
    </SlideItem>
    </section>
  </div>
</template>
<script>
import SlideItem from "./components/slideItem.vue";
import Base from "./state";
export default {
  name: "Setting",
  components: {
    SlideItem,
  },
  data() {
    return {
      Base,
      edit: -1,
      isNew: false,
      text: "",
      stoptimer:null
    };
  },
  methods: {
    // Base.ding = true
    switchDing() {
      this.Base.ding = true;
      localStorage.setItem("sound", "0");
      sound.stop();
      playsound();
      if (this.stoptimer) {
        clearTimeout(this.stoptimer);
      }
      this.stoptimer = setTimeout(() => {
        sound.stop();
      }, 5000);
    },
    goHome() {
      this.$router.push("/");
    },
    newEditHandler() {
      if (this.isNew) {
        if (this.text && this.Base.types.length < 8) {
          this.Base.types.push(this.text);
        }
        this.text = "";
        this.isNew = false;
      } else {
        this.text = "";
        this.isNew = true;
      }
    },
    deleteHandler(index) {
      this.Base.types.splice(index, 1);
    },
    newHandler(e) {
      this.text = e.target.value;
    },
    inputHandler($event, index) {
      this.Base.types[index] = $event.target.value;
    },
    editHandler(index) {
      if (this.edit == index) {
        this.edit = -1;
      } else {
        this.edit = index;
        this.$nextTick(() => {
          this.$refs.editor[0].focus();
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.setting-page {
  width: 100%;
  min-height: 100%;
  max-width: 27rem;
  margin: 0 auto;
  padding: 1rem 0.9rem 1.5rem;
  color: var(--text);
}
.setting-header {
  padding: 0.35rem 0.15rem 0.5rem;
  h1 {
    margin: 0;
    color: var(--text-strong);
    font-size: 1.55rem;
    line-height: 1.1;
    font-weight: 900;
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
.setting-section {
  margin-top: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.editor {
  padding: 0 0.85rem;
  outline: none;
  width: 100%;
  height: 2.35rem;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border);
  background: rgba(255, 255, 255, 0.62);
  color: var(--text-strong);
  box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.12);
  font-weight: 800;
  &:focus {
    border-color: var(--warning);
    box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.18);
  }
}
.p-title {
  box-sizing: border-box;
  padding-left: 0.25rem;
  margin: 0;
  color: var(--text-strong);
  font-size: 0.95rem;
  font-weight: 900;
}
.sub-title {
  box-sizing: border-box;
  padding-left: 0.25rem;
  font-size: 0.72rem;
  margin: -0.3rem 0 0.1rem;
  color: var(--text-muted);
  font-weight: 700;
}
.types {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.row-label {
  flex: 1;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 900;
  color: var(--text-strong);
}
</style>
