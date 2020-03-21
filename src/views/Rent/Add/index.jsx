import React, { Component } from "react";
import MyNavBar from "../../../components/MyNavBar";
import styles from "./index.module.scss";
import {
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Flex,
  Modal,
  Toast
} from "antd-mobile";
import HouseMatch from "../../../components/HouseMatch";
import { connect } from 'react-redux'

const Item = List.Item;

// 房屋类型
const roomTypeData = [
  { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
  { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
  { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
  { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
  { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" }
];

// 楼层
const floorData = [
  { label: "高楼层", value: "FLOOR|1" },
  { label: "中楼层", value: "FLOOR|2" },
  { label: "低楼层", value: "FLOOR|3" }
];

// 朝向：
const orientedData = [
  { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
  { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
  { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
  { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
  { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
  { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
  { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
  { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" }
];

class RentAdd extends Component {
  constructor(props) {
    super();

    this.state = {
      community: {
        // 小区
        community: props.community,
        communityName: props.communityName
      },
      files: [], // 存放上传的图片
      description: '', // 房屋描述
      floor: null, // 房屋楼层
      oriented: null, // 房屋朝向
      price: '', // 租金
      roomType: null, // 房屋类型
      size: '', // 尺寸
      supporting: '' ,// 房屋配套,
      title: '' // 房屋标题
    };
  }

  // 更改模型的值
  changeValue = (name,value) => {
    this.setState({
      [name]: value
    })
  }

  onChange = (files, type, index) => {
    // console.log(files, type, index);
    this.setState({
      files,
    });
  }

  // 取消
  cancel = () => {
    Modal.alert('提示', '放弃发布房源?', [
      { text: '放弃', onPress: () => this.props.history.goBack() },
      {
        text: '继续编辑',
        onPress: null
      }
    ])
  }

  // 发布房源
  publishHouse = async () => {
    //1、校验数据完整性
    const {
      community: { community },
      files,
      price,
      size,
      title,
      description,
      roomType,
      floor,
      oriented,
      supporting
    } = this.state

    if (!community) {
      Toast.info('请选择小区',1)
      return
    }

    if (price.trim().length === 0) {
      Toast.info('请输入价格',1)
      return
    }

    if (size.trim().length === 0) {
      Toast.info('建筑面积', 0.8)
      return
    }

    if (!roomType) {
      Toast.info('请选择户型', 0.8)
      return
    }

    if (!floor) {
      Toast.info('请选择所在楼层', 0.8)
      return
    }

    if (!oriented) {
      Toast.info('请选择朝向', 0.8)
      return
    }

    if (title.trim().length === 0) {
      Toast.info('请输入标题', 0.8)
      return
    }

    if (files.length === 0) {
      Toast.info('请上传头像', 0.8)
      return
    }

    if (supporting.trim().length === 0) {
      Toast.info('请选择房屋配套', 0.8)
      return
    }

    //2、上传图片
    const formData = new FormData()
    files.forEach(item => {
      formData.append('file',item.file)
    })

    const result = await this.axios.post('/houses/image', formData ,{
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    
    if (result.data.status !== 200) {
      Toast.info('上传失败',1)
      return
    }

    //3、发布
    const data = {
      title,
      description,
      houseImg: result.data.body.join('|'),
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    }

    const res = await this.axios.post('/user/houses', data)
    if (res.data.status === 200) {
      Toast.info('上传成功',1.5,() => {
        // 成功之后，跳转到我的出租列表中去
        this.props.history.push('/rent')
      })
    }
  }

  render() {
    const {
      community: { communityName },
      files,
      price,
      size,
      title,
      description,
      roomType,
      floor,
      oriented
    } = this.state;
    return (
      <div className={styles.root}>
        <MyNavBar title="发布房源" />
        <List renderHeader={() => "房源信息"} className="my-list">
          <Item
            extra={communityName || "请输入小区名称"}
            arrow="horizontal"
            onClick={() => this.props.history.push("/rent/search")}
          >
            小区名称
          </Item>
          <InputItem value={price} onChange={val => this.changeValue('price',val)} placeholder="请输入租金/月" extra="¥/月">
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem value={size} onChange={val => this.changeValue('size',val)} placeholder="建筑面积" extra="㎡">
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} onChange={val => this.changeValue('roomType',val[0])} cols={1}>
            <List.Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </List.Item>
          </Picker>
          <Picker data={floorData} value={[floor]} onChange={val => this.changeValue('floor',val[0])} cols={1}>
            <List.Item arrow="horizontal">所在楼层</List.Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} onChange={val => this.changeValue('oriented',val[0])} cols={1}>
            <List.Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </List.Item>
          </Picker>
        </List>
        <List renderHeader={() => "房屋标题"} className="my-list">
          <InputItem value={title} onChange={val => this.changeValue('title',val)} placeholder="请输入标题（例如：整租 小区名 2室 5000元）"></InputItem>
        </List>
        <List renderHeader={() => "房屋头像"} className="my-list">
          <ImagePicker
            files={files}
            onChange={this.onChange}
            selectable={files.length < 9}
            multiple={true}
          />
        </List>
        <List renderHeader={() => "房屋配套"} className="my-list">
          <HouseMatch selectable onChange={val => this.setState({supporting: val})}/>
        </List>
        <List renderHeader={() => "房屋描述"} className="my-list">
          <TextareaItem value={description} onChange={val => this.changeValue('description',val)} rows={5} placeholder="请输入房屋描述" />
        </List>
        <Flex className={styles.bottom}>
          <Flex.Item onClick={this.cancel} className={styles.cancel}>取消</Flex.Item>
          <Flex.Item onClick={this.publishHouse} className={styles.confirm}>提交</Flex.Item>
        </Flex>
      </div>
    );
  }
}

const mapStateToProps = ({community}) => {
  return community
}

export default connect(mapStateToProps,null)(RentAdd)
