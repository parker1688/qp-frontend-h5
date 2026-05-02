<template>
  <view>
    <uv-drop-down 
      ref="dropDown"
      sign="dropDown_1" 
      text-active-color="#ae8d45"
      :extra-icon="{name:'arrow-down-fill',color:'#666',size:'26rpx'}" 
      :extra-active-icon="{name:'arrow-up-fill',color:'#ae8d45',size:'26rpx'}"
      :defaultValue="defaultValue" 
      :custom-style="{padding: '0 30rpx'}" 
      @click="selectMenu"
    >
      <uv-drop-down-item 
        name="order" 
        type="1" 
        :label="dropItem('order').label" 
        :value="dropItem('order').value">
      </uv-drop-down-item>
      <uv-drop-down-item 
        name="dateObj" 
        type="2" 
        :label="dropItem('dateObj').label" 
        :value="dropItem('dateObj').value">
      </uv-drop-down-item>
      <uv-drop-down-item 
        name="type" 
        type="2" 
        :label="dropItem('type').label" 
        :value="dropItem('type').value">
      </uv-drop-down-item>
    </uv-drop-down>
    
    <uv-drop-down-popup 
      sign="dropDown_1" 
      :click-overlay-on-close="true"
     
      @clickItem="clickItem"
      @popupChange="change"
    >
      <template #default>
		  <view class="tab-box">
			  <uv-tabs :current="current" :list="currentDropItem.child" lineWidth="0" keyName="label" :activeStyle="{
			       	border: 'none',
			       	color:'#ffffff',
			       	height:'58rpx',
			    width: '180rpx',
			    borderRadius:'30rpx',
			    display:' flex',
			    alignItems: 'center',
			    justifyContent:' center',
			    padding: '0 10rpx',
			    background:'#ae8d45',
			    fontFamily: '$uni-family-Medium',
			    fontSize:'26rpx',
			    boxSizing: 'border-box',
			    }" :inactiveStyle="{
			     color: '#303133',
			     border: '2rpx solid #CCCCCC',
			     fontFamily: '$uni-family-Regular',
			     height:'58rpx',
			     width: '180rpx',
			     borderRadius:'30rpx',
			     display:' flex',
			     alignItems: 'center',
			     justifyContent:' center',
			     fontSize:'26rpx',
			     padding: '0 10rpx',
			     boxSizing: 'border-box',
			  }" @click="getCurrent" itemStyle="padding-left:0; padding-right: 18rpx; height: 58rpx;"></uv-tabs>
		  </view>
       
      </template>
    </uv-drop-down-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

// 响应式数据
const dropDown = ref(null)
const activeName = ref('order')
const result = ref([])
const defaultValue = ref([0, 'all', '0'])
const current = ref(0)
const lineBg = ref('') // 请替换为实际的图片路径

// 创建数据映射对象
const dataMap = {
  order: {
    label: '赛事',
    value: 'all',
    color: '#333'
  },
  dateObj: {
    label: '日期',
    value: 'all',
    activeIndex: 0,
    color: '#333',
    activeColor: '#ae8d45',
    child: [
      { label: '07-31', value: '星期四' },
      { label: '07-30', value: '星期三' },
      { label: '07-29', value: '星期二' },
      { label: '07-28', value: '星期一' }
    ]
  },
  type: {
    label: '种类',
    value: "all",
    activeIndex: 0,
    activeColor: '#ae8d45',
    child: [
      { label: '足球', value: '1' },
      { label: '篮球', value: '2' },
      { label: '羽毛球', value: '3' },
      { label: '网球', value: '4' },
      { label: '田径', value: '4' }
    ]
  }
}

// 计算属性 - 安全版本
const dropItem = computed(() => (name) => {
  const resultObj = {}
  const find = result.value.find(item => item.name === name)
  
  if (find) {
    resultObj.label = find.label
    resultObj.value = find.value
    resultObj.name = find.label
  } else {
    const data = dataMap[name] || {}
    resultObj.label = data.label || ''
    resultObj.value = data.value || ''
    resultObj.name = data.label || ''
  }
  return resultObj
})

const currentDropItem = computed(() => dataMap[activeName.value] || {})

// 方法
const change = (e) => {
}

const selectMenu = (e) => {
  const { name, active, type } = e
  activeName.value = name
  
  if (type == 1) {
    return
  } else {
    const find = result.value.find(item => item.name == activeName.value)
    const currentItem = dataMap[activeName.value]
    
    if (find && currentItem) {
      const findIndex = currentItem.child.findIndex(
        item => item.label == find.label && item.value == find.value
      )
      currentItem.activeIndex = findIndex
    } else if (currentItem) {
      currentItem.activeIndex = 0
    }
  }
}

const clickItem = (e) => {
  let { label, value } = e
  const findIndex = result.value.findIndex(item => item.name == activeName.value)
  const currentItem = dataMap[activeName.value]
  
  if (defaultValue.value.indexOf(value) > -1 && currentItem?.label) {
    label = currentItem.label
  }
  
  if (findIndex > -1) {
    result.value[findIndex] = {
      name: activeName.value,
      label,
      value
    }
  } else {
    result.value.push({
      name: activeName.value,
      label,
      value
    })
  }
  
  result.value = result.value.filter(
    item => defaultValue.value.indexOf(item.value) == -1
  )
  
  uni.showModal({
    content: `筛选的值：${JSON.stringify(result.value)}`
  })
}

const getCurrent = (e) => {
  current.value = e.index
}

// 生命周期
onPageScroll(() => {
  dropDown.value?.init()
})
</script>
<style lang="scss" scoped>
	.tab-box{
		padding: 20rpx;
	}
	:deep(.uv-drop-down) {
	  border-bottom: none !important;
	}
</style>