import fs from 'node:fs'

import { createContentLoader } from 'vitepress'

import { reckonReadTime } from '../tools/reckonReadTime'


const now_time = new Date().getTime()

const getArticleTime = (id) => {
    let arr = id.toString().split('')
    let year = `20` + arr[0] + arr[1]
    let month = `${arr[2]}` + `${arr[3]}`
    let day = `${arr[4]}` + `${arr[5]}`
    const res = new Date(`${year}-${month}-${day} 00:00:00`).getTime()
    return res
}

const judgeIsMonthly = (time) => {
    let res = now_time - time
    if (res < 2592000000) {
        return true
    } else {
        return false
    }
}
const judgeIsWeekly = (time) => {
    let res = now_time - time
    if (res < 604800000) {
        return true
    } else {
        return false
    }
}


export default createContentLoader('repo/posts/*.md', {
    includeSrc: true, // 包含原始 markdown 源?
    excerpt: true,    // 包含摘录?
    transform(rawData) {
        // 追加 frontmatter 配置
        for (let i = 0; i < rawData.length; i++) {
            // 阅读时间
            let readTime = reckonReadTime(rawData[i].src)
            rawData[i].frontmatter.readTimeNum = readTime
            // 文章属性
            rawData[i].frontmatter.type = '文章'
            // 文件名称
            let filename = rawData[i].url
            filename = filename.split('sts/')[1]
            filename = filename.split('.ht')[0]
            rawData[i].frontmatter.filename = filename
            // 文章标题
            rawData[i].frontmatter.title = filename.split(' ')[1]
            // 文章ID
            rawData[i].frontmatter.zoid = filename.split(' ')[0]
            // 文章的时间戳
            rawData[i].frontmatter.time = getArticleTime(filename.split(' ')[0])
            // 判断是否为本月文章
            rawData[i].frontmatter.isMonthly = judgeIsMonthly(rawData[i].frontmatter.time)
            // 追加本月文章的标签
            if (rawData[i].frontmatter.isMonthly) {
                let arr = []
                if (rawData[i].frontmatter.tags) {
                    arr.push(...rawData[i].frontmatter.tags)
                }
                arr.push('本月文章')
                rawData[i].frontmatter.tags = arr
            }
            // 判断是否为本周文章
            rawData[i].frontmatter.isWeekly = judgeIsWeekly(rawData[i].frontmatter.time)
            // 追加本周文章的标签
            if (rawData[i].frontmatter.isWeekly) {
                let arr = []
                if (rawData[i].frontmatter.tags) {
                    arr.push(...rawData[i].frontmatter.tags)
                }
                arr.push('本周文章')
                rawData[i].frontmatter.tags = arr
            }

        }
        // 将数据倒序后返回，保证最新的文章在前
        return rawData.reverse()
    }
})