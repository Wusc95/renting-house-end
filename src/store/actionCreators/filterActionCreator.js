import { SET_FILTER_DATA,SET_OPEN_TYPE,SET_SELECT_TITLE_VALUE ,SET_VALUE } from '../actionTypes/filterActionType'
import { axios } from '../../utils/axios'
import { getCurrentCity } from '../../utils/city'

/**
 * 同步的action
 * @param {*} data 
 * 直接返回对象，是同步的
 */
export const setFilterData = data => {
    return {
        type: SET_FILTER_DATA,
        payload: data
    }
}

/**
 * 同步的action
 * @param {*} data  'area'、'mode'、'price'、'more'
 * 直接返回对象，是同步的
 */
export const setOpenType = data => {
    return {
        type: SET_OPEN_TYPE,
        payload: data
    }
}

/**
 * 同步的action
 * @param {*} data  {area:true}、{mode:true}、{price:true}
 * 直接返回对象，是同步的
 */
export const setSelectTitleValue = data => {
    return {
        type: SET_SELECT_TITLE_VALUE,
        payload: data
    }
}

/**
 * 同步的action
 * @param {*} data  {area:["subway", "5号线(环中线)", "SUY|20c28513-719a-b480"]}、{mode:["true"]}、{price:["PRICE|5000"]}
 * {more: [xxx,xxx]}
 * 直接返回对象，是同步的
 */
export const setValue = data => {
    return {
        type: SET_VALUE,
        payload: data
    }
}

/**
 * 异步的action
 * 异步的action返回箭头函数
 * 发请求请求Filter需要的数据，然后保存到仓库中(触发同步action)
 */
export const asyncSetFilterData = () => {
    return async diaptch => {
        // 拿到定位城市的id
        const { value } = await getCurrentCity()

        const result = await axios.get('/houses/condition',{
            params: {
                id: value
            }
        })

        // 异步action一定要触发同步的action才能把数据保存到仓库中
        diaptch(setFilterData(result.data.body))
    }
}