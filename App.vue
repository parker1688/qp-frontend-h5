<script>
	//#ifdef H5
	import {getWindowUrl} from "@/utils/index";
	//#endif
  //#ifndef H5
  import {toPtah} from "@/utils/index";
  //#endif
	import {getMerchantCode, getVersion} from "@/api/user";
	import {getKfUrlBut, getylGameListBut} from "@/hooks/publicRequest";
  import {clientlogsBut} from "@/hooks/clientlogs";
	import {userStore} from "@/stores/user"
  import { startStore } from "@/stores/start"
	// #ifdef APP-PLUS
	import appUpdate from '@/uni_modules/leruge-app-update/js_sdk/leruge-app-update.js'
  import environment from '@/utils/environments.ts'
  const agentId = environment.envConfigs.agentId
	// #endif

	export default {
		onLaunch: function(e) {
			uni.hideTabBar()
			const inviteCode = userStore().merchantCode
			//#ifdef H5
			const merchantUrl = userStore().merchantUrl
			const href = getWindowUrl()
			userStore().setIsDownShow(true)
			if (merchantUrl !== href) {
				if (e.query.agent) {
					userStore().setAgentId(+e.query.agent)
					this.init({invite_code: e.query.agent})
				} else {
					this.init({url: href})
				}
			} else {
				if (inviteCode) {
					getKfUrlBut()
          getylGameListBut()
				}
			}
			screen.orientation.lock('portrait');
			//#endif

    // #ifdef MP
    //   this.init({
    //     invite_code: 10000
    //   })
      //#endif


			// #ifdef APP-PLUS
      plus.screen.lockOrientation('portrait-primary');
      if (inviteCode) {
        this.checkUpdate()
        getKfUrlBut()
        getylGameListBut()
      }else {
        const openInstall = uni.requireNativePlugin('openinstall-plugin')
        // 初始化 SDK
        openInstall.init()
        // 获取安装参数（首次安装时携带的渠道/动态参数）
        openInstall.getInstall(8, (res) => {
          let agent =res.bindData?Number(JSON.parse(res.bindData).agent) : agentId
          userStore().setAgentId(agent)
          this.init({invite_code: agent})
        })
      }

      // 监听网络状态变化
      uni.onNetworkStatusChange((res) => {
        if (!res.isConnected) {
          uni.showToast({
            title: '当前无网络连接，请检查网络设置',
            icon: 'none'
          });
        }else {
          // 网络已连接
          console.log('当前网络状态已连接');
        }
      });
			//#endif





		},

		onShow: function() {
      // #ifdef APP-PLUS
      startStore().setHomeReloadPage(-1)
      //#endif
      // 初始检查
      uni.getNetworkType({
        success: (res) => {
          if (res.networkType === 'none') {
            uni.showToast({
              title: '当前无网络连接，请检查网络设置',
              icon: 'none'
            });
          }
        }
      });
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			compares(v1 = '0', v2 = '0') {
				v1 = String(v1).split('.')
				v2 = String(v2).split('.')
				const minVersionLens = Math.min(v1.length, v2.length);
				let result = 0;
				for (let i = 0; i < minVersionLens; i++) {
					const curV1 = Number(v1[i])
					const curV2 = Number(v2[i])

					if (curV1 > curV2) {
						result = 1
						break;
					} else if (curV1 < curV2) {
						result = -1
						break;
					}
				}
				if (result === 0 && (v1.length !== v2.length)) {
					const v1BiggerThenv2 = v1.length > v2.length;
					const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
					for (let i = minVersionLens; i < maxLensVersion.length; i++) {
						const curVersion = Number(maxLensVersion[i])
						if (curVersion > 0) {
							v1BiggerThenv2 ? result = 1 : result = -1
							break;
						}
					}
				}
				return result;
			},
			checkUpdate() {
				getVersion().then(res => {
					if (res.code == 0) {
            userStore().setVersion(res.data.version)
						// #ifdef APP-PLUS
					//	const platform = plus.os.name.toLowerCase();
            if(res.data.version){
              plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
                let wgtUpdate = this.compares(res.data.version, widgetInfo.version) === 1;

                if (wgtUpdate) {
                  userStore().setDownVersion({})
                  toPtah('/pages/version/index',2)
                  let updateInfo = {
                    platform: 'android',
                    updateContent:'',
                    downUrl: res.data.cdn_url,
                    version: res.data.version,
                    force: true,
                    mainColor: 'ae8d45',
                  }
                  appUpdate(updateInfo)
                }
              });
            }
						// #endif
					}
				})
			},
			init(data) {
				getMerchantCode({...data}).then(res => {
					if (res.code == 0 && res.data?.merchant_code) {
						userStore().setMerchantCode(res.data.merchant_code)
						getKfUrlBut()
						//#ifdef H5
						const href = getWindowUrl()
						userStore().setMerchantUrl(href)
						//#endif
						getylGameListBut()
            clientlogsBut({ID:'startID',item:{...data,...res.data}})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/css/flex.scss";

	uni-page-body,
	html,
	body {
		background: #1c1c1c !important;
		//#ifdef H5
		height: 100%;
		width: 100vw;
		margin: 0;
		padding: 0;
		position: fixed;
		left: 0;
		top: 0;
		//#endif
		overscroll-behavior: none !important;
		touch-action: none;
		/* 禁止触摸滑动 */
		will-change: transform;
		overflow: hidden;
		font-family: $uni-family-Regular;


	}

	.uv-tabbar__placeholder {
		height: 0 !important;
	}

	view,
	text {
		font-family: $uni-family-Regular;
	}

	.overflow-y {
		height: 100% !important;
		overflow: hidden;
		overflow-y: auto !important;
		overscroll-behavior-y: none !important;
	}

	.kfClass {
		font-size: 22rpx;
		font-family: $uni-family-Regular;
		margin-left: 10rpx;
		color: #FFFFFF;
	}

	/*每个页面公共css */
	::-webkit-scrollbar {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none !important;
		background: white !important;
	}

	.uni-page-head__title {
		font-weight: 500;
	}

	::-webkit-scrollbar {
		width: 0 !important;
	}

	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}
</style>