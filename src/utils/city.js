import { axios } from "./axios";

const getCity = () => {
  return window.localStorage.getItem("my_city");
};

/**
 * 保存city到本地
 *
 * @param {*} city {label:'深圳',value:"AREA|a6649a11-be98-b150"}
 */
const setCity = city => {
  window.localStorage.setItem("my_city", JSON.stringify(city));
};

/**
 * 获取定位城市
 */
const BMap = window.BMap;
const getCurrentCity = () => {
  const city = getCity();

  if (city) {
    // 存在
    return Promise.resolve(JSON.parse(city));
  } else {
    // 不存在
    return new Promise((resolve, reject) => {
      // 1、先利用百度地图定位API获取经纬度和城市名
      var myCity = new BMap.LocalCity();
      myCity.get(async result => {
        // 2、利用城市名调用后台的接口，获取到城市对象信息(对象中的value将来是要用于发送请求的)
        const res = await axios.get(`/area/info?name=${result.name}`);

        // 3、缓存到本地
        setCity(res.data.body)

        // 4、resolve把结果返回出去
        resolve(res.data.body)
      });
    });
  }
};

export { getCurrentCity, setCity };
