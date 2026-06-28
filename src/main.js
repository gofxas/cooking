import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { Howl } from "howler";

window.sound_list = ["Sentimientos que no.mp3"];
localStorage.setItem("sound", "0");

window.sound = new Howl({
  src: [`/sound/${sound_list[0]}`],
  html5: true,
  volume: 1,
});

window.playsound = (seconds = 0) => {
  sound.seek(seconds);
  sound.play();
};
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
