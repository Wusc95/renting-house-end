import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../FilterFooter'
import { bindActionCreators } from 'redux'
import * as filterActionCreator from '.././../../../store/actionCreators/filterActionCreator'

class FilterPicker extends Component {
    constructor(props) {
        super()

        this.state = {
            openType: props.openType, // 第一次时候的openType
            value : props.selectValue[props.openType]
        }
    }

    /**
     * 
     * @param {*} props 新的props
     * @param {*} state 上一次的状态
     */
    static getDerivedStateFromProps(props, state){
        if (props.openType !== state.openType) {
            return {
                openType: props.openType,
                value: props.selectValue[props.openType]
            }
        } else {
            return state
        }
    }

    changeValue = data => {
        this.setState({
            value: data
        })
    }

    render() {
        const {openType,area,subway,rentType,price} = this.props
        let data = null
        let cols = 3
        switch (openType) {
            case 'area':
                data = [area,subway]
                break;

            case 'mode':
                cols = 1
                data = rentType
                break;

            case 'price':
                cols = 1
                data = price
                break;
        
            default:
                break;
        }

        return (
            <div>
                <PickerView onChange={this.changeValue} value={this.state.value} cols={cols} data={data}/>
                <FilterFooter cancelClick={() => {
                    this.props.setOpenType('')
                }} okClick={() => {
                    this.props.setOpenType('')
                    this.props.setValue({[this.props.openType]:this.state.value})
                }}/>
            </div>
        )
    }
}

const mapStateToProps = ({filters: {openType,selectValue,filterData: {area,subway,rentType,price}}}) => {
    // 赋值给FilterPicker组件的props
    return {
        openType,
        area,
        subway,
        rentType,
        price,
        selectValue
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(filterActionCreator,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterPicker)
