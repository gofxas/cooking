<template >
  <div>
    <p class="p-title">标签</p>
    <p class="sub-title">最多创建8个常用标签</p>
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
    <template v-if="Base.types.length < 8">
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
        <div style="flex: 1; text-align: center; font-size: 0.7rem" v-else>
          左划创建
        </div>
      </SlideItem>
    </template>
    <p class="p-title">提示音？</p>
    <SlideItem
      @edit="Base.ding = true"
      @delete="Base.ding = false"
      :right_threshold="100"
      del_text="关闭"
      edit_text="打开"
    >
      <div style="flex: 1; text-align: center; font-size: 0.7rem">
        {{ Base.ding ? "打开" : "关闭" }}
      </div>
    </SlideItem>
    <p class="p-title">首页</p>
    <SlideItem @edit="goHome" :right_threshold="0" edit_text="回到首页">
      <div style="flex: 1; text-align: center; font-size: 0.7rem">
        左划回首页
      </div>
    </SlideItem>
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
    };
  },
  methods: {
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
.editor {
  padding: 0.2rem 0.5rem;
  outline: none;
  width: 100%;
  height: 1.5rem;
  border-radius: 6px;
  border: none;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5) inset,
    0 4px 6px -4px rgb(0 0 0 / 0.15) inset;
}
.p-title {
  box-sizing: border-box;
  padding-left: 0.5rem;
}
.sub-title {
  box-sizing: border-box;
  padding-left: 0.5rem;
  font-size: 0.6rem;
  margin-bottom: 0.3rem;
  margin-top: -0.5rem;
  color: #fff8;
}
</style>