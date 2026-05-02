<template>
  <view class="badge-container">
    <img src="/static/mission/alert.png" class="custom-badge" />
  </view>
</template>

<script setup>
</script>

<style scoped>
.badge-container {
  position: absolute;
  display: inline-block;
  right: 12rpx;
}

.custom-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 24rpx;
  height: 24rpx;
  transform: translate(30%, -30%);
}
</style>