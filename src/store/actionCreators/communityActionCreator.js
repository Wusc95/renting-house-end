import { SET_COMMUNITY } from '../actionTypes/communityActionType'

/**
 * 生成了一个同步的action对象
 * @param {*} community 
 */
export const setCommunity = community => {
    return {
        type: SET_COMMUNITY,
        payload: community
    }
}