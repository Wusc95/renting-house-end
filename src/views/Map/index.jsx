import React, { Component } from "react";
import styles from "./index.module.scss";
import { Toast } from "antd-mobile";

// 导入子组件
import MyNavBar from "../../components/MyNavBar";
import HouseItem from '../../components/HouseItem'
import { getCurrentCity } from "../../utils/city";

const BMap = window.BMap;

// 圆形覆盖物的样式：
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center"
};

export default class Map extends Component {
  constructor() {
    super()

    this.state = {
      houseList: [], // 房源列表
      isShow: false // 是否显示房源列表
    }
  }

  renderHouseList = () => {
    return <div className={[styles.houseList,this.state.isShow ? styles.show : ''].join(' ')}>
      <div className={styles.titleWrap}>
        <h1 className={styles.listTitle}>房屋列表</h1>
        <a className={styles.titleMore} href="/layout/houselist">更多房源</a>
      </div>
      <div className={styles.houseItems}>
        {this.state.houseList.map(item => {
          return <HouseItem key={item.houseCode} {...item}/>
        })}
      </div>
    </div>
  }

  render() {
    return (
      <div className={styles.map}>
        <MyNavBar title="地图找房" />
        {/* 地图的div */}
        <div id="container"></div>
        {/* 房屋列表 */}
        {this.renderHouseList()}
      </div>
    );
  }

  async componentDidMount() {
    const city = await getCurrentCity();
    this.id = city.value;

    this.initMap(city.label);
  }

  // 初始化地图
  initMap = cityName => {
    // 创建地图实例
    this.map = new BMap.Map("container");

    // 给地图添加一个触摸事件
    this.map.addEventListener('touchstart',() => {
      this.setState({
        isShow: false
      })
    })

    // 创建中心点
    // var point = new BMap.Point(116.404, 39.915)
    // 根据城市的名字，进行地址解析，拿到我们所在城市的经纬度
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      cityName,
      point => {
        if (point) {
          // 设置中心点和缩放级别
          this.map.centerAndZoom(point, 11);

          // 添加覆盖物
          this.renderOverlays(this.id);
        }
      },
      cityName
    );
  };

  /**
   * 根据当前的地图的缩放级别，来决定当前渲染什么形状的覆盖物
   * 以及点击之后，我们要放大的级别
   */
  getTypeAndNextZoom = () => {
    console.log("当前地图的缩放级别",this.map.getZoom())
    let type = 'circle' // 默认我们要渲染圆形覆盖物
    let nextZoom = 13 
    // 获取到当前地图的缩放级别
    const zoom = this.map.getZoom()

    if (zoom >= 10 && zoom <=12) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom >= 12 && zoom <=14) {
      type = 'circle'
      nextZoom = 15
    } else if(zoom >14){
      type = 'rect'
    }

    return {type,nextZoom}
  }

  // 添加覆盖物
  /**
   * 该方法的作用是：
   *  1、发请求，获取数据（获取一级、二级、三级）
   *  2、根据当前的实际情况，决定调用 renderCircleOverlay 或是 renderRectOverlay
   * 来渲染覆盖物
   */
  renderOverlays = async id => {
    Toast.loading("数据加载中...",0);
    // 1.先获取该id下面的所有数据
    const result = await this.axios.get(`/area/map?id=${id}`);
    Toast.hide();

    // 2.调用 getTypeAndNextZoom 获取到我们当前应该渲染什么形状的覆盖物及下一个缩放级别
    const {type,nextZoom} = this.getTypeAndNextZoom()

    // 渲染覆盖物
    result.data.body.forEach(item => {
      if (type === 'circle') { // 要渲染一二级覆盖物
        this.renderCircleOverlay(item,nextZoom)
      } else {
        this.renderRectOverlay(item)
      }
    });
  };

  // 添加一二级圆形覆盖物
  // 每调用一次这个方法，就创建一个圆形覆盖物，并且添加到地图上
  /**
   * item 就是每次渲染一个覆盖物需要的数据
   * nextZoom 13（要显示的是第二级覆盖物）、15（要显示第三级覆盖物）
   */
  renderCircleOverlay = (item,nextZoom) => {
    const {
      count,
      label: name,
      value,
      coord: { longitude, latitude }
    } = item;

    // 根据经纬度创建坐标点，经纬度千万不要写错
    var point = new BMap.Point(longitude, latitude);

    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35) //设置文本偏移量
    };
    var label = new BMap.Label("", opts); // 创建文本标注对象
    // 设置内容
    label.setContent(`<div class=${styles.bubble}>
      <p class=${styles.name}>${name}</p>
      <p class=${styles.name}>${count}</p>
    </div>`);

    // 设置样式
    // 去掉默认的红色的圈圈
    label.setStyle(labelStyle);

    // 添加点击一级覆盖物的点击事件
    label.addEventListener("click", () => {
      console.log("11111111");
      setTimeout(() => {
        //1、把之前的一级覆盖物干掉
        this.map.clearOverlays();
      }, 0);

      // 2、重新设置中心点和缩放级别
      this.map.centerAndZoom(point, nextZoom);

      // 3、根据点击的一级覆盖物的value，去请求一级覆盖物下面二级覆盖物的数据
      // 点击二级覆盖物，请求下面的三级覆盖物的数据
      this.renderOverlays(value)
    });

    // 不要忘记把覆盖物添加到地图上
    this.map.addOverlay(label);
  }

  // 添加三级方形的覆盖物
  // 每调用一次这个方法，就创建一个方形覆盖物，并且添加到地图上
  /**
   *  item 就是每次渲染一个覆盖物需要的数据
   */
  renderRectOverlay = (item) => {
    const {
      count,
      label: name,
      value,
      coord: { longitude, latitude }
    } = item;

    // 根据经纬度创建坐标(经度在前面，并且经度的数量一般比纬度大)
    var point = new BMap.Point(longitude, latitude);

    var opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-50, -20)    //设置文本偏移量
    }

    var label = new BMap.Label("", opts);  // 创建文本标注对象
    label.setStyle(labelStyle);
    label.setContent(`
      <div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}</span>
        <i class=${styles.arrow}></i>
      </div>
    `)

    // 给三级覆盖物添加点击事件
    label.addEventListener('click', e => {
      if (e && e.changedTouches) {
        const {clientX,clientY} = e.changedTouches[0]
        const moveX = window.screen.width / 2 - clientX
        const moveY = window.screen.height / 2 - clientY - 330 / 2

        // 可以滚动多少距离，让其在可视区域居中显示
        this.map.panBy(moveX,moveY)
      }
      
      // 根据小区的id，去加载小区下面的房源列表数据
      this.fetchHouseListData(value)
    })

    // 把覆盖物添加到地图上
    this.map.addOverlay(label)
  }

  // 加载小区的房源数据
  fetchHouseListData = async id => {
    Toast.loading('数据加载中...',0)
    const result = await this.axios.get(`/houses?cityId=${id}`)
    Toast.hide()

    this.setState({
      houseList: result.data.body.list,
      isShow: true
    })
  }
}
