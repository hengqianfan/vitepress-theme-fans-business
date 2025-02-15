

import PageHome from './page-home/index.vue'

import TagInfo from './tag-info/index.vue'


const allGlobalComponents = {

    PageHome,
    TagInfo


}

export default {
    install(app) {
        Object.keys(allGlobalComponents).forEach(key => {
            app.component(key, allGlobalComponents[key])
        })

    }
}

