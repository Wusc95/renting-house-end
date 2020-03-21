import React, { Component } from 'react'
import MyNavBar from '../../components/MyNavBar'
import HouseItem from '../../components/HouseItem'
import { WingBlank } from 'antd-mobile'

export default class Rent extends Component {
    state = {
        houseList: null
    }

    componentDidMount() {
        this.getHouseListData()
    }

    getHouseListData = async () => {
        const result = await this.axios.get('/user/houses')

        if (result.data.status === 200) {
            this.setState({
                houseList: result.data.body
            })
        }
    }

    render() {
        const { houseList } = this.state
        return (
            <div>
                <MyNavBar title="我的出租列表"/>
                <WingBlank size="md">
                {
                   houseList && houseList.map(item => {
                       return <HouseItem key={item.houseCode} {...item}/>
                   })
                }
                </WingBlank>
            </div>
        )
    }
}
