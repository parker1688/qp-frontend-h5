<template>
      <view  class="u-flex-xy-center" :style="`width:${parent.width};height:${parent.height};padding: ${parent.padding};`">
        <image  style="width:316rpx;height: 349rpx" src="/static/search/notData.png"></image>
      </view>
</template>

<script lang="ts" setup>
const parent = withDefaults(
    defineProps<{
      width : string,
      height:string,
      padding:string,
    }>(),
    {
      width: '100vw',
      height:'750rpx',
      padding:'100rpx 0'
    }
)
</script>

<style scoped>
</style>