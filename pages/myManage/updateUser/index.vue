<template>
  <view class="uptPwd-box">
    <uv-navbar :placeholder="true" bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="修改用户信息">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
    </uv-navbar>

      <view class="uptPwd u-flex-grow">
        <view>
          <view class="box-item border u-flex-center-between">
            <label>用户ID</label>
            <view class="u-flex-center-end">{{userData.user_id}}<image class="code" @click="copyTextBut(userData.user_id)" src="/static/kf/fz.png" /></view>
          </view>
          <view  class="box-item u-flex-center-between">
            <label>注册时间</label>
            <view style="text-align: right">{{userData.create_time}}</view>
          </view>
        </view>
        <view>
          <view  class="box-item border u-flex-center-between">
            <label>头像</label>
            <image @click="getImgOpen" :src="formData.avatar || '/static/my/user/mrtx.jpg'" class="userImg"></image>
          </view>
          <view  class="box-item border u-flex-center-between">
            <label>昵称</label>
            <uv-input v-model="formData.nick_name" maxlength="6" inputAlign="right" placeholder="请输入昵称" border="none"></uv-input>
          </view>
          <view  class="box-item border u-flex-center-between">
            <label>生日</label>
            <view style="text-align: right;" @click="getTime"  :style="!formData.birthday?'color: rgb(192, 196, 204);font-size: 14px':''">
              {{formData.birthday?formatDate(formData.birthday, 'Y-M-D'):'完善生日信息，获取生日专属福利'}}
            </view>
          </view>
          <view  class="box-item u-flex-center-between">
            <label>性别</label>
            <view>
              <uv-radio-group v-model="formData.sex">
                <uv-radio  :name="1" style="margin-right: 40rpx">男</uv-radio>
                <uv-radio  :name="2">女</uv-radio>
              </uv-radio-group>
            </view>
          </view>

        </view>
        <view class="but">
          <uv-button  @click="handleSubmit"  text="保存" customStyle="width:calc(100vw - 62rpx);height: 96rpx;background-color: #ae8d45;font-size: 32rpx;
         color: #ffffff; border-radius: 48rpx;" ></uv-button>
        </view>



        <uv-datetime-picker ref="datePicker" v-model="dateValue" :formatter="formatter" minDate="1900-01-01" mode="date" :maxDate="new Date()"
                            @confirm="confirm"></uv-datetime-picker>
        <dayPopup ref="dayPopupRef" :list="listIMG" :isImgTrue="true" title="选择头像" @getData="getUserImg" />
      </view>

  </view>

</template>

<script lang="ts" setup>
	import { ref, reactive, shallowRef, computed } from "vue";
	import { updateUserinfo } from "@/api/user";
  import {getUserinfoBut} from "@/hooks/publicRequest"
  import dayPopup from  '@/components/dayPopup/index'
	import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
  const dayPopupRef = shallowRef()
  import { copyText,pagesRoute} from "@/utils/index"
	const formRef = shallowRef()
	const datePicker = shallowRef()
	import { userStore } from "@/stores/user"
	import { formatDate } from "@/utils/time"
	const userData = computed(() => userStore().userInfo)
  const listIMG=ref([
    {img:'/static/my/tx/bf.png'},
    {img:'/static/my/tx/cs.png'},
    {img:'/static/my/tx/kb.png'},
    {img:'/static/my/tx/mx.png'},
  ])
	const formData = reactive({
    nick_name: '',
    sex: 0,
    avatar: '',
    birthday: '',
	})
	const dateValue = ref(Number(new Date()))
  const copyTextBut=(text:any)=>{
    copyText(text)
  }
  const getImgOpen=()=>{
    dayPopupRef.value.open()
  }
  const getUserImg=(it:any)=>{
    formData.avatar=it.img
  }
	const getTime = () => {
    if(!userData.value.birthday){
      datePicker.value.open()
    }
	}
	const confirm = (time) => {
		formData.birthday = formatDate(time.value, 'Y-M-D') + ' 00:00:00'
	}
	const formatter = (type : any, value : any) => {
		if (type === 'year') {
			return `${value}年`
		}
		if (type === 'month') {
			return `${value}月`
		}
		if (type === 'day') {
			return `${value}日`
		}
		return value
	}

	// 提交数据
	const handleSubmit = async () => {
    const regs=/^[\u4e00-\u9fa5a-zA-Z0-9]+$/

    if(!regs.test(formData.nick_name)){
      uni.showToast({
        icon: 'none',
        title: '呢称由字母数字汉字组成',
      })
      return
    }
    if(!formData.birthday){
      uni.showToast({
        icon: 'none',
        title: '完善生日信息，获取生日专属福利',
      })
      return
    }
    if(!formData.sex){
      uni.showToast({
        icon: 'none',
        title: '请选择性别',
      })
      return
    }
		await updateUserinfo(formData)
    getUserinfoBut()
    uni.showToast({ icon: 'success', title: '保存成功' })
	}

  onShow(()=>{
    for (const key in formData) {
      if (userData.value[key]&&userData.value[key] != null && userData.value[key] != undefined) {
        if(key=='birthday'){
          //@ts-ignore
          formData[key] =formatDate(userData.value[key], 'Y-M-D')
        }else {
          //@ts-ignore
          formData[key] = userData.value[key]
        }

      }
    }
  })
</script>

<style lang="scss" scoped>
.uptPwd-box{
  width: 100vw;
  background-color: $uni-default-back0Color;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  .uptPwd {
    width:100%;
    border-radius: 30rpx 30rpx 0 0;
    background-color:$uni-bg-color-grey;
    height: 100%;
    overflow: hidden;
    >view{
      width: calc(100% - 50rpx);
      padding:0 25rpx;
      background-color:$uni-bg-color;
      border-radius: 30rpx;
      margin-bottom: 20rpx;
    }

    .border{
      border-bottom: 2rpx solid $uni-default-backColor;
    }
    .box-item{
      background-color:$uni-bg-color;
      padding:0 25rpx;
      height: 100rpx;
      label{
        width: 200rpx;
        text-align: left;
      }
      .code{
        width: 50rpx;
        height: 50rpx;
        margin-left: 20rpx;
      }
      .userImg{
        width: 70rpx;
        height: 70rpx;
        background: wheat;
        border-radius: 50%;
      }
    }
    .but{
      margin:200rpx 31rpx 50rpx 31rpx;
      padding: 0;
      background: transparent;

    }
  }
}

</style>