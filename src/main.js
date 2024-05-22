import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { Howl } from "howler";

let defaultSound = Number(localStorage.getItem("sound")) || 2;
window.sound_list = ["ding.mp3", "capybara.mp3", "Sentimientos que no.mp3"];

window.sound = new Howl({
  src: [`/sound/${sound_list[defaultSound]}`],
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
