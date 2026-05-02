<template>
  <view>
    <web-view  :src="path"></web-view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
import {ref} from "vue";
const path=ref('')
onLoad((it:any)=>{
  path.value = JSON.parse(it.path)

})
</script>

<style scoped>

</style>