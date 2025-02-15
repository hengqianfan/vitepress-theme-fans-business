<template>
    <div class="fb-all">
        <div class="fb-nav">
            <!-- <el-cascader :options="options" :props="props" clearable /> -->

            <div class="fb-nav-kinds">

                <div class="fb-nav-kinds-item" @click="findX(item)" v-for="item in navlist">{{ item }}</div>

            </div>

        </div>


        <div class="fb-content">



            <div class="fb-card" v-for="item in showData">
                <div class="fb-card-cover">
                    <img :src="withBase(getImgSrc(item.frontmatter.zoid, item.frontmatter.cover))" alt=""
                        class="fb-card-cover-img">
                </div>
                <a class="fb-card-title" :href="withBase(item.url)">{{ item.frontmatter.title }}</a>
                <div class="fb-card-info">
                    <div class="fb-card-time">{{ formatDate(item.frontmatter.zoid) }}</div>

                    <div class="fb-card-tags" v-for="tag in item.frontmatter.tags.slice(0, 3)">{{ tag }}</div>


                </div>
            </div>
        </div>


        <div class="pa-pagination">
            <el-pagination :default-page-size="pageSize" layout="total, prev, pager, next, jumper"
                :total="sortedData.length" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { withBase, useData } from 'vitepress'
import { data } from '/data/articles.data.js'


const navlist = ['全部', '耳机', '键盘', '鼠标', '其他']

const pageSize = 8

const getImgSrc = (momo, cover) => {
    // 如果存在特定封面，特定封面优先
    if (cover) {
        return cover
    }

    return `/cover/${momo}.png`
}

// 是否开放所有文章

const isOpen = ref(true)




// 设置过滤，将不公开文章排除
const removeData = (data) => {
    let outdata = []
    for (let i = 0; i < data.length; i++) {

        if (data[i].frontmatter.open !== false) {
            outdata.push(data[i])
        }
    }
    return outdata
}

const allData = isOpen.value ? data : removeData(data)

let sortedData = ref(allData)

// 展示的数据
let showData = ref(sortedData.value.slice(0, pageSize))


const show_tabs = ref(false)


// 定义 tag 对象
let all_tags = ref([])
// 定义当前的 tag
let now_tag = ref('全部')

// 从数据中提取所有的 tag 放入 tag 数组中
const getALLTags = (data) => {
    // 先清空数据
    all_tags.value = []


    // 临时存放数据的数组
    let temp_arr = []
    // 遍历原始数据，把所有 tag 添加到 临时数组中
    for (let i = 0; i < data.length; i++) {



        // 先判断是否存在 信息中是否存在 tag ⭐
        if (data[i].frontmatter.tags) {
            // 获取当前文章的 tag 数组
            let now_tagarr = data[i].frontmatter.tags
            // 解构数组后，再添加到临时数组中
            temp_arr.push(...now_tagarr)
        }

    }


    // 数组去重并统计数量
    let obj = {}
    for (let i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i] in obj) {
            obj[temp_arr[i]] = obj[temp_arr[i]] + 1;
        } else {
            obj[temp_arr[i]] = 1;
        }
    }

    // 补充一个总数
    // 暂时这样写，有更好的写法再说
    obj.全部文章 = data.length



    // 根据属性值排序

    const sortObj = (obj) => {
        // 降序排序value值
        let sortValue = Object.values(obj).sort((a, b) => {
            return b - a;
        })
        // 创建结果数组
        let res = {}
        // keys数组
        let keys = Object.keys(obj);
        // 给value值赋值相应keys值
        for (let i in sortValue) {
            // console.log(i);
            keys.forEach((item) => {
                if (sortValue[i] === obj[item]) {
                    res[item] = sortValue[i];
                }
            })
        }
        return res;
    }


    // 最后，把数据赋值给外部对象
    all_tags.value = sortObj(obj)

}

getALLTags(allData)

const getIcon = (momo) => {
    if (momo) {
        return `/icon/png/${momo}.png`
    }
    return `/icon/png/article.png`
}

const getTitle = (momo) => {
    // 去掉文件的后缀名
    let res = momo.split('.md')[0]
    return res
}

const toPage = (momo) => {
    open(`/mo-notes/articles/${momo}`)
}




const findX = (momo, autoClose) => {
    if (autoClose) {
        show_tabs.value = false
    }

    now_tag.value = momo

    let res = []
    if (momo == '全部') {


        res = allData


        console.log(res);

    } else {
        res = allData.filter((item, index) => {
            if (item.frontmatter.tags) {
                if (item.frontmatter.tags.includes(momo)) {
                    return item
                }
            }
        })
    }

    sortedData.value = res

    showData.value = res.slice(0, pageSize)


}


// 随机排列
const re_arr = (arr) => {
    showData.value = arr.sort(() => Math.random() - 0.5);
}






const findArticlesNum = (momo) => {
    if (momo == `本月文章`) {
        return all_tags.value[`本月文章`]

    } else if (momo == `本周文章`) {
        return all_tags.value[`本周文章`]
    } else {
        return 0
    }
}


const handleCurrentChange = (momo) => {
    let start = (momo - 1) * pageSize
    let end = momo * pageSize
    showData.value = sortedData.value.slice(start, end)
}

const formatDate = (momo) => {
    let year = momo.slice(0, 2)
    let month = momo.slice(2, 4)
    let day = momo.slice(4, 6)
    return `⏰20${year}年${month}月${day}日`
}



const openWeb = (url) => {
    // console.log(url);

    // window.open("https://www.baidu.com", '_blank')
}

</script>

<style lang="scss" scoped>
.fb-all {
    // background-color: #b5bbc0;
    width: 100%;
    min-height: 92vh;

    display: flex;
    flex-direction: column;

    align-items: center;



    .fb-nav {
        // background-color: white;
        min-height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .fb-nav-kinds {

            width: 1000px;
            min-height: 50px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            margin: 10px;
            background-color: white;
            border-radius: 50px;
            box-shadow: 0px 25px -20px 20px rgb(0, 0, 0, 0.4);

            .fb-nav-kinds-item {

                height: 30px;
                width: 100px;
                line-height: 30px;
                border-radius: 15px;
                text-align: center;
                font-family: '优设标题黑';
                letter-spacing: 5px;
                cursor: pointer;
                position: relative;
                display: inline-block;
                z-index: 2;
                transition: color 0.5s;
            }

            .slide {}

            .fb-nav-kinds-item::after {
                content: '';
                background-color: rgb(28, 58, 63);
                width: 100%;
                height: 100%;
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50px;
                z-index: -1;
                opacity: 0;
                transition: top 0.3s;
            }

            .fb-nav-kinds-item:hover {
                color: white;

            }

            .fb-nav-kinds-item:hover::after {
                top: 50%;
                opacity: 1;

            }


        }
    }


    .fb-content {
        // background-color: red;
        min-height: 50vh;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .fb-card {

            border-radius: 10px;
            margin: 15px;
            display: flex;
            flex-direction: column;
            width: 320px;
            height: 260px;
            background-color: rgb(211, 216, 220);
            box-shadow: 1px 1px 1px rgb(229, 227, 227);




            .fb-card-cover {
                width: 320px;
                height: 180px;
                overflow: hidden;
                border-radius: 10px 10px 0 0;


                .fb-card-cover-img {
                    width: 100%;
                    height: 100%;
                    transition: all 0.8s;

                }




            }






            .fb-card-title {
                height: 40px;
                font-size: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;

                text-align: center;
                // background-color: rebeccapurple;
                font-family: '剑豪体';
                color: rgb(87, 84, 84);
                transition: all 0.8s;



            }

            .fb-card-info {

                height: 40px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                background-color: white;


                .fb-card-time {
                    margin-left: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 5px;
                    height: 20px;
                    color: #828e98;
                    // background-color: #afbdc8;
                    font-size: 10px;
                    border-radius: 5px;
                    margin-right: 20px;
                }

                .fb-card-tags {
                    margin-left: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 5px;
                    height: 20px;
                    color: #828e98;
                    background-color: #e6e9eb;
                    font-size: 10px;
                    border-radius: 5px;
                }
            }


        }

    }
}
</style>