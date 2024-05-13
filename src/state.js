import { ref, reactive, watch } from "vue";
import _ from "lodash";

let base = {
  types: ["煮", "炸", "蒸", "炖", "炒", "烧"],
  ding: true,
};

let user_states = JSON.parse(localStorage.getItem("user_states") || "{}");

if (user_states && user_states.constructor == Object) {
  base = { ...base, ...user_states };
}

const base_state = reactive(_.cloneDeep(base));

watch(base_state, function (datas) {
  localStorage.setItem("user_states", JSON.stringify(datas));
});

export default base_state;
