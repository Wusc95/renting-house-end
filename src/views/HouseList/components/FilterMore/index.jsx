import React, { Component } from 'react'
import styles from './index.module.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as filterActionCreator from '../../../../store/actionCreators/filterActionCreator'
import FilterFooter from '../FilterFooter'
import classNames from 'classnames'

class FilterMore extends Component {
    // constructor() {
    //     super()

    //     this.state = {
    //         selectedValues: this.props.more
    //     }
    // }

    state = {
        selectedValues: this.props.more
    }

    toggleSelect = value => {
        let oldValues = this.state.selectedValues
        if (oldValues.includes(value)){
            // const index = oldValues.findIndex(val => val === value)
            // oldValues.splice(index,1)

            oldValues = oldValues.filter(val => val !== value)
        } else {
            oldValues.push(value)
        }

        this.setState({
            selectedValues: oldValues
        })        
    }

    renderItems = data => {
        return <dd className={styles.dd}>
            {data.map(item => {
                return <span 
                    onClick={() => this.toggleSelect(item.value)} 
                    className={classNames(styles.tag,{[styles.tagActive] : this.state.selectedValues.includes(item.value)})} 
                    key={item.value}>{item.label}</span>
            })}
        </dd>
    }

    render() {
        const { roomType,oriented,floor,characteristic } = this.props
        return (
            <div className={styles.root}>
                {/* 遮罩 */}
                <div onClick={() => this.props.setOpenType('')} className={styles.mask}></div>
                {/* 内容区域 */}
                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        <dt className={styles.dt}>户型</dt>
                        { this.renderItems(roomType) }
                        <dt className={styles.dt}>朝向</dt>
                        { this.renderItems(oriented) }
                        <dt className={styles.dt}>楼层</dt>
                        { this.renderItems(floor) }
                        <dt className={styles.dt}>房屋亮点</dt>
                        { this.renderItems(characteristic) }
                    </dl>
                </div>
                <div className={styles.footer}>
                    <FilterFooter cancelText="清除" 
                    cancelClick={() => this.setState({selectedValues:[]})}
                    okClick={() => {
                        this.props.setOpenType('')
                        this.props.setValue({more: this.state.selectedValues})
                    }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({filters: {filterData: {roomType,oriented,floor,characteristic} , selectValue: { more }}}) => {
    return {
        roomType,
        oriented,
        floor,
        characteristic,
        more
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(filterActionCreator,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterMore)
