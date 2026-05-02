<template>
  <web-view  class="webview"  :src="path"></web-view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import {ref} from "vue";
const path=ref('')
onLoad((e)=>{
   path.value=e.path
})
</script>

<style scoped>

</style>