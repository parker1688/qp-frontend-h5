<template>
	<view class="container-box">
		<uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="新手教程">
		  <template v-slot:left>
		    <view class="uv-nav-slot">
		      <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
		    </view>
		  </template>
		  
		</uv-navbar>
		 <activity/>
	</view>
</template>

<script setup>
	import { pagesRoute} from "@/utils/index"
	import activity from  './activity'
	
</script>

<style>

</style>
