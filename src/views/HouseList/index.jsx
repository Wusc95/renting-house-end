import React, { Component } from "react";
import styles from "./index.module.scss";
import { Flex } from "antd-mobile";
import SearchBar from "../../components/SearchBar";
import { getCurrentCity } from "../../utils/city";
import Filter from "./components/Filter";
import Sticky from '../../components/Sticky'
import { Toast } from "antd-mobile";
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader
} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import { connect } from "react-redux";

class HouseList extends Component {
  constructor() {
    super();

    this.state = {
      cityName: "深圳",
      list: null, // 房源列表的数据
      count: 0 // 根据条件查询出的，满足要求的房源总数
    };
  }

  id = null; // 城市id
  filters = {}; // 查询时候的筛选条件

  async componentDidMount() {
    const result = await getCurrentCity();

    // 获取城市id
    this.id = result.value;

    this.setState({
      cityName: result.label
    });

    // 调用获取房源列表数据的方法
    this.getHouseListData();
  }

  componentWillReceiveProps(props) {
    if (!props.isCanSearch) return;

    // 处理数据

    // 处理area
    if (props.area.length > 2) {
      const key = props.area[0];

      // this.filters.area / this.filters.subway
      this.filters[key] =
        props.area[2] === "null" ? props.area[1] : props.area[2];
    } else {
      this.filters.area = null;
    }

    // 处理mode【看清楚】
    if (props.mode[0] !== "null") {
      this.filters.rentType = props.mode[0];
    } else {
      this.filters.rentType = null;
    }

    // 处理price
    if (props.price[0] !== "null") {
      this.filters.price = props.mode[0];
    } else {
      this.filters.price = null;
    }

    // 处理more
    if (props.more.length > 0) {
      this.filters.more = props.more.join(",");
    } else {
      this.filters.more = null;
    }

    // 只有在点击确定的时候，才执行 getHouseListData
    this.getHouseListData();
  }

  getHouseListData = async () => {
    Toast.loading("数据加载中...", 0);
    const result = await this.axios.get("/houses", {
      params: {
        ...this.filters,
        cityId: this.id,
        start: 1,
        end: 20
      }
    });

    Toast.hide();

    if (result.data.status === 200) {
      this.setState({
        list: result.data.body.list,
        count: result.data.body.count
      });
    }
  };

  // 渲染每一行的方法
  rowRenderer = ({ key, index, style }) => {
    const item = this.state.list[index];

    if (!item) {
      // 当我们后面没有数据的时候，我们先显示一个展位图
      return (
        <div key={key} style={style}>
          <p className={styles.loading}>加载中...</p>
        </div>
      );
    }

    return <HouseItem style={style} key={key} {...item} />;
  };

  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async (resolve,reject) => {
        Toast.loading("数据加载中...", 0);
        const result = await this.axios.get("/houses", {
        params: {
            ...this.filters,
            cityId: this.id,
            start: 1 + startIndex,
            end: 1 + stopIndex
        }
        });

        Toast.hide();

        if (result.data.status === 200) {
            this.setState({
                list: {...this.state.list,...result.data.body.list},
                count: result.data.body.count
            }, () => {
                // 这个地方代表发送网络请求完毕了，可以去重新渲染数据了
                resolve()
            });
        }

    })
  }

  // 判断这一行是否加载完毕
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  }

  //渲染房源列表
  renderHouseList = () => {
    const { count } = this.state;

    return (
      <div className={styles.houseList}>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={count}
          minimumBatchSize={20}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height ,isScrolling, onChildScroll ,scrollTop }) => (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      autoHeight
                      height={height}
                      rowCount={count}
                      rowHeight={120}
                      rowRenderer={this.rowRenderer}
                      width={width}
                      isScrolling = {isScrolling}
                      scrollTop={scrollTop}
                      onRowsRendered={onRowsRendered}
                      onScroll={onChildScroll}
                      ref={registerChild}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.root}>
        {/* 头部 */}
        <Flex className={styles.listHeader}>
          <i className="iconfont icon-back"></i>
          <SearchBar
            className={styles.mySearchBar}
            cityName={this.state.cityName}
          />
        </Flex>
        {/* 过滤组件 */}
        {/* <Filter /> */}
        {/* 吸顶组件 */}
        <Sticky>
          <Filter />
        </Sticky>
        {this.state.list && this.renderHouseList()}
      </div>
    );
  }
}

const mapStateToProps = ({
  filters: {
    selectValue: { area, mode, price, more },
    isCanSearch
  }
}) => {
  return {
    area,
    mode,
    price,
    more,
    isCanSearch
  };
};

export default connect(mapStateToProps, null)(HouseList);
