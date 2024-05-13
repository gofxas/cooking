import fs from "fs";
const ls = [
    "36kr.svg",
    "aibot.svg",
    "ant-design-vue.svg",
    "apifoxcn.svg",
    "arco-design.svg",
    "asiayun.svg",
    "codepen.svg",
    "csdn.svg",
    "electronjs.svg",
    "elementui.svg",
    "flutter.svg",
    "geekbang.svg",
    "gitee.svg",
    "github.svg",
    "juejin.svg",
    "kaifa.baidu.svg",
    "leetcode.svg",
    "mdn-web-docs.svg",
    "oschina.svg",
    "qiniu.svg",
    "react.svg",
    "runnergo.svg",
    "stackoverflow.svg",
    "typescript.svg",
    "uniapp.svg",
    "v2ex.svg",
    "vite.svg",
    "vuejs.svg",
    "w3school.svg"
]

const nls = [];
ls.forEach(item => {
    const obj = {};
    obj.name = item.replace('.svg','');
    obj.icon = item;
    nls.push(obj)
})

fs.writeFileSync("t.json", JSON.stringify(nls));