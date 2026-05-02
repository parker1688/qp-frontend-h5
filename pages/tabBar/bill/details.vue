<template>
	<view class="container u-flex-column">
      <uv-navbar placeholder bgColor="#1c1c1c" :title="title" @leftClick="pagesRoute" leftIconColor="#fff"
                 :titleStyle="{color:'#fff'}">
				 <template v-slot:left>
				   <view class="uv-nav-slot">
				     <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
				   </view>
				 </template>
        <template v-slot:right>
          <view class="u-flex" @click="dayOpen" style="color:#fff;font-size: 24rpx;">
            {{ getTypeList(dayNum)}}<uv-icon name="/static/my/xl.png"></uv-icon>
          </view>
        </template>
      </uv-navbar>
      <view class="summarybox">
		  <view v-if="dropDownShow" class="day-box" style="z-index: 9999;">
		    <view class="u-flex u-flex-between">
		      <view class="label"> 总计：{{pager.count}}单</view>
		    </view>
		    <view class="dayList-box  u-flex u-flex-wrap">
		      <view class="dayItem u-flex-shrink0 u-flex-xy-center" v-for="(it,index) in dayList"
		        :class="{action:it.type==dayNum}" :key="index" @click="dayBut(it,index)">{{it.name}}</view>
		    </view>
		    <view class="u-flex u-flex-around daybut">
		      <view class="u-flex-xy-center" @click="dayClose">取消</view>
		      <view class="u-flex-xy-center" @click="dayOkBut">确定</view>
		    </view>
		  </view>
		  <view v-if="dropDownShow2" class="day-box">
		    <view class="u-flex-column">
		      <view class="u-flex-column" style="margin-bottom: 20rpx;" v-for="item,index in filterList" :key="index">
		        <view class="label">{{item.label}}</view>
		        <view class="u-flex dayList-box u-flex-y-center">
		          <view class="dayItem u-flex-xy-center" :class="{action:temp[item.name]==it.value
		          }" v-for="it,idx in item.option" :key="idx" @click="selectItem(index,item,it)">
		            {{it.label}}
		          </view>
		        </view>
		      </view>
		    </view>
		    <view class="u-flex u-flex-around daybut">
		      <view class="u-flex-xy-center" @click="dayClose2">取消</view>
		      <view class="u-flex-xy-center" @click="dayOkBut2">确定</view>
		    </view>
		  </view>
        <view class="summary u-flex-shrink0">
          <view class="line1">
            <view class="tab" v-for="it,index in resfilter" style="margin-right: 20rpx;">
              {{it.label}}:<text style="color:#1c1c1c;margin-left: 10rpx;">{{it.value}}</text>
            </view>
            <view class="shaixuan" v-if="!isTrue"> 筛选<uv-icon @click="showFilter" style="margin-left: 6rpx;"
                                                              name="/static/my/xl.png" />
            </view>
          </view>
          <view class="line2">
            <view>总计：<text>{{pager.count}}</text>单</view>
            <view>投注金额：<text>{{pager.totalBetAmount}}</text>CNY</view>
            <view v-if="!isTrue">输赢：<text :class="{red:pager.totalNetAmount>=0,
					green:pager.totalNetAmount<0
					}">{{pager.totalNetAmount>=0?"+":""}}{{pager.totalNetAmount}}</text>CNY</view>
          </view>
        </view>
      </view>
    <!--    #ifdef APP-PLUS || MP-WEIXIN  -->
    <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topBotHeight}px - 160rpx )`" @scrolltolower="scrolltolower" :enable-flex="true">
      <!--    #endif    -->
      <!--    #ifdef H5  -->
      <scroll-view scroll-y="true" :style="`height:calc(${homeHeight - topBotHeight}px - 160rpx )`" @scrolltolower="scrolltolower" :enable-flex="true">
        <!--    #endif    -->
        <detailCard :data="item" v-for="(item,index) in pager.lists" :key="index" style="margin-top:16rpx"></detailCard>
        <view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center" style="padding: 25rpx;font-size: 22rpx;color: #a9a9a9;">已全部加载~</view>
        <uvNoData v-if="!pager.loading&&!pager.lists.length" />
      </scroll-view>
	</view>
</template>

<script setup lang="ts">
	import {pagesRoute} from "@/utils/index"
	import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
	import detailCard from './components/detailCard.vue'
	import { usePaging } from "@/hooks/usePaging";
	import { venueGameRecord,venueGameRecordUnsettled } from "@/api/money";

	import {ref, computed, reactive, nextTick} from 'vue'
	import { userStore } from "@/stores/user"
	import { startStore } from "@/stores/start"
	const topBotHeight = computed(() => {
		return uni.getSystemInfoSync().statusBarHeight  + 44
	})
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
	// const topHeight = computed(() => {
	// 	return uni.getSystemInfoSync().statusBarHeight
	// })
	const dropDownShow = ref(false)
	const dropDownShow2 = ref(false)
	const params = ref([{ label: '结算:', value: "全部" }])
	const dayNum = ref(1)
	const dayNumType = ref(0)
	const filterList = ref([
		{ label: "结算", name: "jiesuan", option: [{ label: '全部', value: "" }] },
		{ label: "输赢", name: "status", option: [{ label: '全部', value: "" }, { label: '输', value: "2" }, { label: '赢', value: "1" }] },
	])
  const isTrue=computed(()=>startStore().isTrueBill)
	const title=ref("")
	const temp = reactive({
		jiesuan: "",
		status: ""
	})
	const formData = reactive({
		time_type: 1,
		// jiesuan: "",
		status: "",
		venue_code:"",
		game_type:""
	})
	const selectItem = (index : number, obj1 : any, obj2 : any) => {
		temp[obj1.name] = obj2.value

	}
	const { pager, resetPageNum, getLists, resetPage, delPage } = usePaging({
		fetchFun:!isTrue.value?venueGameRecord:venueGameRecordUnsettled,
		params: formData,
	});
	const dayList = computed(() => startStore().dayTypeList)
	const isToken = computed(() => userStore().token ? true : false)
	const getTypeList = (type) => {
		const res = dayList.value.find(it => it.type == type)
		return res.name
	}
	const dayBut = (it : any, index : number) => {
		dayNum.value = it.type
	}
	const showFilter = () => {
		dropDownShow2.value = true
	}
	const resfilter = computed(() => {
		if(!isTrue.value){
			return filterList.value.map(filterItem => {
				// 获取当前字段在formData中的值
				const currentValue = formData[filterItem.name];
			
				// 在option中查找对应的label
				const matchedOption = filterItem.option.find(
					opt => opt.value === String(currentValue)
				);
			
				// 如果没有匹配项，使用第一个option的label（通常是"全部"）
				const displayLabel = matchedOption
					? matchedOption.label
					: (filterItem.option[0]?.label || '');
			
				return {
					label: filterItem.label, // 字段的label，如"结算"
					value: displayLabel      // 当前值对应的显示label，如"全部"
				};
			});
		}else{
			return [{label:"全部",value:"未结算"}]
		}
		
	})
	const dayClose = () => {
		// dayNum.value = dayNumType.value
		dropDownShow.value = false
	}
	const dayClose2 = () => {
		// dayNum.value = dayNumType.value
		dropDownShow2.value = false
	}
	const scrolltolower = (item : any) => {
		resetPageNum()
	}
	const dayOkBut = () => {
		dayNumType.value = dayNum.value
		getStartAtEndAt(dayNumType.value)
		resetPage()
		dropDownShow.value = false
	}
	const dayOkBut2 = () => {
		Object.keys(temp).map((key) => {
			formData[key] = temp[key]
		})
		resetPage()
		dropDownShow2.value = false
	}
	const dayOpen = () => {
		dropDownShow.value = !dropDownShow.value
	}
	const getStartAtEndAt = (type : number) => {
		formData.time_type = type
	}
	onLoad((params) => {
    title.value=params.title
    formData.time_type= dayNum.value=params.dayNum
	 formData.venue_code=params.venue_code
	 formData.game_type=params.game_type
   getLists()

	})
</script>

<style lang="scss">
	.day-box {
		width: calc(100vw - 60rpx);
		// height: 340rpx;
		padding: 24rpx 30rpx;
		z-index: 6666;
		position: fixed;
		left: 0;
		background: white;
		box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);

		.label {
			font-family: $uni-family-Regular;
			font-size: 24rpx;
		}

		.dayList-box {
			.dayItem {
				width: 206rpx;
				height: 60rpx;
				border-radius: 30rpx;
				border: 2rpx solid $uni-bg-color-grey;
				margin-right: 36rpx;
				margin-top: 20rpx;
				font-size: 28rpx;
				background-color: $uni-bg-color-grey;
				box-sizing: border-box;
			}

			.dayItem:nth-child(3n) {
				margin-right: 0;
			}

			.action {
				color: $uni-default-color;
				border: 2rpx solid $uni-default-color;
				background-color: $uni-text-color-inverse;
				box-sizing: border-box;
			}
		}

		.daybut {
			margin: 40rpx;
			font-family: $uni-family-Medium;

			>view {
				width: 206rpx;
				height: 78rpx;
				color: $uni-default-color;
				background: $uni-default-xzColor;
				border-radius: 40rpx;
				font-size: 28rpx;
			}

			view:last-child {
				width: 446rpx;
				height: 78rpx;
				color: #FFFFFF;
				background: $uni-default-color;
				margin-left: 36rpx;
			}
		}
	}
	.container {
     width: 100vw;
    //#ifdef H5
    height: 100%;
    //#endif
    //#ifndef H5
    height: 100vh;
    //#endif
    height: 100vh;
    overflow: hidden;
    background-color: $uni-bg-color-grey;
    border-radius: 30rpx 30rpx 0 0;
    .scrollBox{
      width: 100vw;
      overflow: hidden;
      background-color: $uni-bg-color-grey;
    }
    .summarybox{
      height: 160rpx;
      width: 100vw;
      overflow: hidden;
      .summary {
        border-radius: 30rpx;
        background-color: $uni-bg-color;
        padding: 18rpx 30rpx;
        display: flex;
        flex-direction: column;
        .line1 {
          display: flex;
          padding-bottom: 14rpx;
          border-bottom: 2rpx solid #ddd;

          .tab {
            border: 2rpx solid #ddd;
            padding: 10rpx 25rpx;
            border-radius: 26rpx;
            font-family: $uni-family-Medium;
            font-size: 22rpx;
            color: #6e6e6e
          }

          .shaixuan {
            display: flex;
            margin-left: auto;
            align-items: center;
            font-size: 24rpx;
          }
        }

        .line2 {
          display: flex;
          margin-top: 20rpx;
          font-family: $uni-family-Regular;
          font-size: 22rpx;
          justify-content: space-between;
          color: #6e6e6e;
          padding-bottom: 6rpx;

          .red {
            color: #d80000
          }

          .green {
            color: #009a00
          }
        }
      }
    }

	}

	.act {
		color: #ae8d45;
		border: 0.0625rem solid #ae8d45;
		background-color: #fff;
		box-sizing: border-box;
	}
</style>