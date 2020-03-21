import React, { Component } from "react";
import { BASE_URL } from "../../utils/url";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import { Link } from "react-router-dom";

import styles from "./index.module.scss";

// 加载导航菜单需要的图片
import image1 from "../../assets/images/nav-1.png";
import image2 from "../../assets/images/nav-2.png";
import image3 from "../../assets/images/nav-3.png";
import image4 from "../../assets/images/nav-4.png";

import SearchBar from "../../components/SearchBar";
import { getCurrentCity } from "../../utils/city";

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      swipers: null, // 轮播图
      groups: null, // 租房小组
      news: null, // 最新资讯
      cityName: "深圳" // 定位城市的名字
    };
  }

  // 定义的实例属性
  navs = [
    { icon: image1, text: "整租", path: "/layout/houselist" },
    { icon: image2, text: "合租", path: "/layout/houselist" },
    { icon: image3, text: "地图找房", path: "/map" },
    { icon: image4, text: "去出租", path: "/rent/add" }
  ];

  async componentDidMount() {
    // 调用获取获取当前城市的API，获取城市名称
    const city = await getCurrentCity();
    this.setState({
      cityName: city.label
    });

    // 加载轮播图数据
    this.getSwiperData();

    // 加载租房小组数据
    this.getGroupsData();

    // 加载资讯的数据
    this.getNewsData();
  }

  getSwiperData = async () => {
    const result = await this.axios.get("/home/swiper");

    if (result.data.status === 200) {
      this.setState({
        swipers: result.data.body
      });
    }
  };

  getGroupsData = async () => {
    const result = await this.axios.get(
      "/home/groups?area=AREA%7C88cff55c-aaa4-e2e0"
    );

    if (result.data.status === 200) {
      this.setState({
        groups: result.data.body
      });
    }
  };

  getNewsData = async () => {
    const result = await this.axios.get(
      "/home/news?area=AREA%7C88cff55c-aaa4-e2e0"
    );

    if (result.data.status === 200) {
      this.setState({
        news: result.data.body
      });
    }
  };

  // 渲染轮播图
  renderSwiper = () => {
    return (
      <Carousel autoplay infinite>
        {this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{ display: "inline-block", width: "100%", height: 212 }}
          >
            <img
              src={`${BASE_URL}${item.imgSrc}`}
              alt=""
              style={{ width: "100%", verticalAlign: "top" }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event("resize"));
                this.setState({ imgHeight: "auto" });
              }}
            />
          </a>
        ))}
      </Carousel>
    );
  };

  // 渲染导航菜单
  renderNav() {
    return (
      <Flex className={styles.nav}>
        {this.navs.map(item => {
          return (
            <Flex.Item key={item.text}>
              <Link to={item.path}>
                <img src={item.icon} alt="" />
                <p>{item.text}</p>
              </Link>
            </Flex.Item>
          );
        })}
      </Flex>
    );
  }

  // 渲染租房小组
  renderGroups = () => {
    return (
      <div className={styles.groups}>
        <Flex justify="between">
          <Flex.Item style={{ fontSize: 18, fontWeight: "bold" }}>
            租房小组
          </Flex.Item>
          <Flex.Item align="end">更多</Flex.Item>
        </Flex>
        <Grid
          data={this.state.groups}
          columnNum={2}
          hasLine={false}
          square={false}
          renderItem={item => (
            <div className={styles.navItem}>
              <div className={styles.left}>
                <p>{item.title}</p>
                <p>{item.desc}</p>
              </div>
              <div className={styles.right}>
                <img src={`${BASE_URL}${item.imgSrc}`} />
              </div>
              <div></div>
            </div>
          )}
        />
      </div>
    );
  };

  // 渲染最新资讯
  renderNews = () => {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新资讯</h3>
        <WingBlank size="md">
          {this.state.news.map(item => {
            return (
              <div key={item.id} className={styles.newsItem}>
                <div className={styles.imgWrap}>
                  <img
                    className={styles.img}
                    src={`${BASE_URL}${item.imgSrc}`}
                    alt=""
                  />
                </div>
                <Flex
                  justify="between"
                  className={styles.content}
                  direction="column"
                >
                  <h3 className={styles.title}>{item.title}</h3>
                  <Flex className={styles.info} justify="between">
                    <span>{item.from}</span>
                    <span>{item.date}</span>
                  </Flex>
                </Flex>
              </div>
            );
          })}
        </WingBlank>
      </div>
    );
  };

  render() {
    const { swipers, groups, news } = this.state;
    return (
      <div className={styles.root}>
        <SearchBar cityName={this.state.cityName} />
        {/* 渲染轮播图 */}
        {swipers && this.renderSwiper()}
        {/* 渲染导航菜单 */}
        {this.renderNav()}
        {/* 渲染租房小组 */}
        {groups && this.renderGroups()}
        {/* 渲染最新资讯 */}
        {news && this.renderNews()}
      </div>
    );
  }
}
