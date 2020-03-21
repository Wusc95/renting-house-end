import React, { Component } from "react";

import MyNavBar from "../../components/MyNavBar";
import { getCurrentCity, setCity } from "../../utils/city";

import styles from "./index.module.scss";

import { AutoSizer, List } from "react-virtualized";
import { Toast } from "antd-mobile";

// 标题的高度
const TITLEHEIGHT = 36;
// 每一行的高度
const ROWHEIGHT = 50;
// 有房源的城市
const HASRESOURCECITYS = ["北京", "上海", "广州", "深圳"];
export default class CityList extends Component {
  constructor() {
    super();

    this.state = {
      cityListObj: null, // 左边城市列表对象
      cityIndexList: null, // 右边索引的数组
      selectIndex: 0 // 右边索引选中的索引
    };
  }

  listRef = React.createRef();

  componentDidMount() {
    this.getCityData();
  }

  getCityData = async () => {
    const result = await this.axios.get("/area/city?level=1");

    this.dealWithCityData(result.data.body);
  };

  // 处理服务器返回的数据
  dealWithCityData = async cityList => {
    // 1、处理a-z的数据
    // 最终tempObj ===> {a: [],b:[],...z:[]}
    const tempObj = {};

    cityList.forEach(city => {
      // a b c ...
      const letter = city.short.substr(0, 1);

      if (tempObj[letter]) {
        // 取到了
        tempObj[letter].push(city);
      } else {
        // 没有取到，就代表这是第一次
        tempObj[letter] = [city];
      }
    });

    const tempIndexList = Object.keys(tempObj).sort();

    // 2、处理热门城市数据
    const result = await this.axios.get("/area/hot");
    tempObj["hot"] = result.data.body;
    tempIndexList.unshift("hot");

    // 3、处理定位城市数据
    // currentCity = {label:'深圳',value:"AREA|a6649a11-be98-b150"}
    const currentCity = await getCurrentCity();
    tempObj["#"] = [currentCity];
    tempIndexList.unshift("#");

    // 赋值给模型
    this.setState({
      cityListObj: tempObj,
      cityIndexList: tempIndexList
    });
  };

  /**
   * 格式化标题，把字母转化成文字
   */
  formatTitle = letter => {
    switch (letter) {
      case "#":
        return "定位城市";

      case "hot":
        return "热门城市";

      default:
        return letter.toUpperCase();
    }
  };

  // 切换城市选择
  toggleCity = ({ label, value }) => {
    if (HASRESOURCECITYS.includes(label)) {
      // 传递的名字包含在北上广深里面
      // 保存到本地
      setCity({ label, value });

      // 返回到首页
      this.props.history.goBack();
    } else {
      Toast.info("该城市暂无房源哦~", 1);
    }
  };

  rowRenderer = ({ key, index, style }) => {
    const letter = this.state.cityIndexList[index];
    const list = this.state.cityListObj[letter];

    return (
      <div key={key} style={style} className={styles.city}>
        {/* 渲染标题 */}
        <div className={styles.title}>{this.formatTitle(letter)}</div>
        {// 渲染城市列表
        list.map(item => {
          return (
            <div
              onClick={() => this.toggleCity(item)}
              className={styles.name}
              key={item.value}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };

  // 动态计算每一行的高度
  calcRowHeight = ({ index }) => {
    const letter = this.state.cityIndexList[index];
    const list = this.state.cityListObj[letter];

    return TITLEHEIGHT + list.length * ROWHEIGHT;
  };

  // 渲染右边的索引
  renderCityIndexList = () => {
    const { cityIndexList, selectIndex } = this.state;
    return (
      <div className={styles.cityIndex}>
        {cityIndexList.map((item, index) => {
          return (
            <div key={item} className={styles.cityIndexItem}>
              <span
                onClick={() => this.clickIndexList(index)}
                className={index === selectIndex ? styles.indexActive : ""}
              >
                {item === "hot" ? "热" : item.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // 点击了右边的索引
  clickIndexList = index => {
    // 调用List的滚动方法
    this.listRef.current.scrollToRow(index);
  };

  // 当左边列表滚动的时候
  onRowsRendered = ({ startIndex }) => {
    if (startIndex !== this.setState.selectIndex) {
      this.setState({
        selectIndex: startIndex
      });
    }
  };

  render() {
    const { cityListObj, cityIndexList } = this.state;
    return (
      <div className={styles.citylist}>
        <MyNavBar title="城市选择" />
        {/* 渲染列表 */}
        {cityListObj && (
          <AutoSizer>
            {({ height, width }) => {
              return (
                <List
                  ref={this.listRef}
                  height={height}
                  rowCount={cityIndexList.length}
                  rowHeight={this.calcRowHeight}
                  rowRenderer={this.rowRenderer}
                  width={width}
                  onRowsRendered={this.onRowsRendered}
                  scrollToAlignment="start" // 对齐方式， 不加的话 点击右侧的字母，左侧 列表 滚动的位置不对
                />
              );
            }}
          </AutoSizer>
        )}
        {/* 渲染索引 */}
        {cityIndexList && this.renderCityIndexList()}
      </div>
    );
  }
}
