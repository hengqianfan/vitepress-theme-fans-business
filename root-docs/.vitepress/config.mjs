import { defineConfig } from 'vitepress'

import { setAllSidebars } from '../tools/autoSidebar'



// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "数码佩奇",
  description: "数码博客",
  base: '/vitepress-theme-fans-business/',

  themeConfig: {
    logo: '/icon/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '知识库', link: '/repo/notes/00 简述' },

      { text: 'bilibili', link: 'https://space.bilibili.com/3546824455489827' },
      { text: '粉丝群', link: '/repo/pages/fan-base' },


    ],

    sidebar: setAllSidebars([
      ['/repo/posts', 1],
      ['/repo/notes', 1]
    ]),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
