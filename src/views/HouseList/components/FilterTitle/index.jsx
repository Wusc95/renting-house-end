import React, { Component } from 'react'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as filterActionCreator from '../../../../store/actionCreators/filterActionCreator'
// import { setOpenType } from '../../../../store/actionCreators/filterActionCreator'
import classNames from 'classnames'

const types = [
    {name:'区域',type:'area'},
    {name:'方式',type:'mode'},
    {name:'租金',type:'price'},
    {name:'筛选',type:'more'}
]

class FilterTitle extends Component {
    render() {
        return (
            <Flex className={styles.root}>
                {types.map(item => {
                    const isSelect = this.props.selectTitleValue[item.type]

                    return <Flex.Item className={classNames(styles.dropdown,{[styles.selected]: isSelect})} key={item.type} onClick={() => {
                        this.props.setOpenType(item.type)
                        this.props.setSelectTitleValue({[item.type]: true})
                    }}>
                        {item.name}
                        <i className="iconfont icon-arrow"></i>
                    </Flex.Item>
                })}
            </Flex>
        )
    }
}

const mapStateToProps = ({filters: {selectTitleValue}}) => {
    return  { selectTitleValue }
}

const mapDispatchToProps = dispatch => {
    // 简写
    return bindActionCreators(filterActionCreator,dispatch)

    // 一个一个写
    // return {
    //     setMyOpenType:function(data){
    //         dispatch(setOpenType(data))
    //     },
    //       setMySelectxxxx
    // }
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterTitle)
