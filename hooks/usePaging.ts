import { reactive, toRaw } from 'vue'

// 分页钩子函数
interface Options {
  current?: number
  pageSize?: number
  totalBetAmount?: number
  totalNetAmount?: number
  fetchFun: (_arg: any) => Promise<any>
  params?: Record<any, any>
  firstLoading?: boolean
}

export function usePaging(options: Options) {
  const { current = 1, pageSize = 15, fetchFun, params = {}, firstLoading = false } = options
  // 记录分页初始参数
  const paramsInit: Record<any, any> = Object.assign({}, toRaw(params))
  // 分页数据
  const pager = reactive({
    current,
    pageSize,
    loading: firstLoading,
    count: 0,
    lists: [] as any[],
    totalBetAmount:0,
    totalNetAmount:0
  })
  // 请求分页接口
  const getLists = () => {
    pager.loading = true
    return fetchFun({
      current: pager.current,
      pageSize: pager.pageSize,
      ...params
    }).then((res: any) => {
        pager.count = res?.count ||  res?.total
        pager.totalBetAmount=res?.data?.totalBetAmount ||0
        pager.totalNetAmount=res?.data?.totalNetAmount ||0
        const list=res?.data?.list || res?.data || res?.list
        if(list&&list.length){
          pager.lists=[...pager.lists,...list]
        }
        pager.loading = false
        return Promise.resolve(res)
      })
      .catch((err: any) => {
        return Promise.reject(err)
      }).finally(() => {
        pager.loading = false
      })
  }
  // 重置为第一页
  const resetPage = () => {
    pager.current = 1
    pager.lists=[]
    getLists()
  }
  const delPage = () => {
    pager.current = 1
    pager.lists=[]
  }
  const resetPageNum = () => {
    if(pager.lists.length<pager.count){
      pager.current ++
      getLists()
    }

  }
  // 重置参数
  const resetParams = () => {
    Object.keys(paramsInit).forEach((item) => {
      params[item] = paramsInit[item]
    })
    getLists()
  }
  return {
    pager,
    delPage,
    getLists,
    resetParams,
    resetPage,
    resetPageNum
  }
}
