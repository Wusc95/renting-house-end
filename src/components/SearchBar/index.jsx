import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
// import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { withRouter } from 'react-router-dom'

function SearchBar({ cityName,history,className }) {
  return <Flex className={classNames(styles.root,className)}>
      <Flex className={styles.searchLeft}>
          <div onClick={() => {history.push('/citylist')}} className={styles.location}>
            {/* 声明式导航 */}
            {/* <Link to="/citylist"> */}
              <span>{cityName}</span>
              <i className="iconfont icon-arrow"/>
            {/* </Link> */}
          </div>
          <div className={styles.searchForm}>
              <i className="iconfont icon-search"/>
              <span>请输入小区或地址</span>
          </div>
      </Flex>
      <i onClick={() => {history.push('/map')}} className="iconfont icon-map"/>
  </Flex>;
}

SearchBar.propTypes = {
    cityName: PropTypes.string.isRequired
};

export default withRouter(SearchBar);
