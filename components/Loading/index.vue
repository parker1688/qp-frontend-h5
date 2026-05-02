<template>
  <view class="fade-container">
    <text class="fade-dot">·</text>
    <text class="fade-dot">·</text>
    <text class="fade-dot">·</text>
  </view>
</template>

<style>
.fade-container {
  display: flex;
  font-size: 36rpx !important;
  color: #666;
}

.fade-dot {
	width:20rpx;
	
  animation: fade 1.5s infinite both;
}

.fade-dot:nth-child(1) {
  animation-delay: 0s;
}

.fade-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.fade-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes fade {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>