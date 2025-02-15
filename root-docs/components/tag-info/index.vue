<template>
    <div class="ti-all">
        {{ props.momo }}


    </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(['momo'])
</script>

<style lang="scss" scoped>
.ti-all {
    // width: 100%;
    height: 40px;
    margin: 0 auto;
    text-align: center;
    font-size: 10px;
    color: rgb(156, 153, 153);
}
</style>