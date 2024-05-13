import { createRouter, createWebHistory } from "vue-router";
import Index from './Index.vue'
import Setting from './Setting.vue'

const router = createRouter({
    history:createWebHistory("/"),
    routes:[
        {
            path:'/',
            component:Index
        },
        {
            path:'/setting',
            component:Setting
        },
    ]
})

export default router;