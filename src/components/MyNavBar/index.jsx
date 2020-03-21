import React from "react";
import PropTypes from "prop-types";
import { NavBar } from "antd-mobile";
import styles from "./index.module.scss";
import classNames from "classnames";

import { withRouter } from "react-router-dom";

function MyNavBar({ title, history, rightContent ,className }) {
  return (
    <NavBar
      mode="light"
      className={classNames(styles.navBar, className)}
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.goBack()}
      rightContent={rightContent}
    >
      {title}
    </NavBar>
  );
}

MyNavBar.propTypes = {
  title: PropTypes.string.isRequired,
  rightContent: PropTypes.array
};

export default withRouter(MyNavBar);
