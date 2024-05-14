import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
createApp(App).use(router).mount("#app");

let wakeLock = null;

async function requestWacklock() {
  console.log("new wakeLock");
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
  }
}

requestWacklock();

document.addEventListener("visibilitychange", () => {
  if (wakeLock == null && document.visibilityState == "visible") {
    requestWacklock();
  }
  if (wakeLock != null && document.visibilityState != "visible") {
    console.log("release wakeLock");
    wakeLock.release().then(() => (wakeLock = null));
  }
});
