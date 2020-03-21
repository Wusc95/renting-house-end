import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import { setFilterData } from '../../../../store/actionCreators/filterActionCreator'
import * as filterActionCreator from '../../../../store/actionCreators/filterActionCreator'
import styles from './index.module.scss'
import {Spring} from 'react-spring/renderprops'

// 导入的三个子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

class Filter extends Component {
    componentDidMount() {
        // 加载Filter及其子组件展示所需要的数据
        // 触发异步的action，然后在异步的aciton中请求数据
        this.props.asyncSetFilterData()
    }

    renderMask() {
        const openType = this.props.openType

        // if (openType === "" || openType === 'more') return null
        // 当我们的类型等于这三个的时候，代表遮罩要显示出来
        const isShow = openType === "area" || openType === 'mode' || openType === 'price'

        return <Spring to={{ opacity: isShow ? 1 : 0 }} config={{duration:250}}>
            {props => {
                if (props.opacity === 0) {
                    return null
                } else {
                    return <div style={props} onClick={() => this.props.setOpenType('')} className={styles.mask}></div>
                }
            }}
        </Spring>
    }

    render() {
        const openType = this.props.openType
        return (
            <div className={styles.styles}>
                {this.renderMask()}
                <div className={styles.content}>
                    <FilterTitle />
                    {
                        (openType==='area' || openType==='mode' || openType==='price') && <FilterPicker />
                    }
                    {
                        openType==='more' && <FilterMore/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({filters: {openType}}) => {
    return {
        openType
    }
}

const mapDispatchToProps = dispatch => {
    // return {
    //     asyncSetFilterData:function() {
    //         // 触发异步的action
    //         dispatch(setFilterData({floor: [{label: "高楼层", value: "FLOOR|1"}, {label: "中楼层", value: "FLOOR|2"}, {label: "低楼层", value: "FLOOR|3"}]}))
    //     },
    //     setFilterData: {
    //     }
    // }
    return bindActionCreators(filterActionCreator,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Filter)
