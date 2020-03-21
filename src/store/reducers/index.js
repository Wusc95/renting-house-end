import { combineReducers } from 'redux'

// 导入子reducer
import filters from './filters'
import community from './community'

export default combineReducers({
    filters,
    community
})