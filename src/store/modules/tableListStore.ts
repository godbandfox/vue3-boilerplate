import {defineStore} from 'pinia';
import router from "@/router";

export const tableListStore = defineStore('tableListStore', {
    state: () => {
        return {
            tabList: [{title: '首页', key: '/home', path: '/home', closable: false}],
            activeKey: ['/home']
        }

    },
    getters: {},
    //  左侧菜单收缩开启
    actions: {
        // 添加tab
        upMenuTabList(payload: any) {
            // 选中的path提交到路由
            this.activeKey = payload.menuItem.keyPath
            router.push({path: this.activeKey[0]})

            // 判断是否存在tab
            if (this.tabList.some(item => {
                return item.key === payload.menuItem.key
            })) {
                return
            }
            // 如果不存在则添加tab
            this.tabList.push({
                title: payload.menuItem.item.title,
                key: payload.menuItem.key,
                path: payload.menuItem.key,
                closable: true
            })

        },
        setActiveTab(payload: any) {
            // 切换tab
            this.activeKey = [payload.activeKey]
            router.push({path: this.activeKey[0]})
        },
        // 关闭tab
        removeTabList(payload: any) {
            console.log(payload.targetKey)
            // 移除tab
            this.tabList = this.tabList.filter(item => {
                return payload.targetKey !== item.key
            })
            console.log(this.tabList[this.tabList.length - 1])
            // 移除的标签不等于要删除的标签时,切换回去,
            this.activeKey = this.activeKey [0] !== payload.targetKey ? [this.tabList[0].key] : [this.tabList[this.tabList.length - 1].key]
            router.push({path: this.activeKey[0]})
        }

    }
});


