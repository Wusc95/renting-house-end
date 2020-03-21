import React, { Component } from "react";
import { SearchBar } from "antd-mobile";
import styles from "./index.module.scss";
import { getCurrentCity } from "../../../utils/city";
import debounce from "lodash/debounce";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as communityActionCreator from '../../../store/actionCreators/communityActionCreator'

class RentSearch extends Component {
  async componentDidMount() {
    const { value } = await getCurrentCity();

    this.id = value;
  }

  state = {
    keyword: "",
    list: null
  };

  changeValue = str => {
    this.setState(
      {
        keyword: str
      },
      () => {
        this.search();
      }
    );
  };

  search = debounce(async () => {
    const result = await this.axios.get("/area/community", {
      params: {
        id: this.id,
        name: this.state.keyword
      }
    });

    if (result.data.status === 200) {
      this.setState({
        list: result.data.body
      });
    }
  }, 500);

  /**
  debounce = (fn, delay = 200) => {
    let timer = null;
    return function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    };
  };

  search = this.debounce(async () => {
    console.log("-----search-----");

    const result = await this.axios.get("/area/community", {
      params: {
        id: this.id,
        name: this.state.keyword
      }
    });

    console.log(result.data);
  }, 500);
   */

  selectCommunity = ({ community,communityName }) => {
    this.props.setCommunity({community,communityName})
    this.props.history.goBack()
  };

  render() {
    const { keyword, list } = this.state;

    return (
      <div className={styles.root}>
        <SearchBar
          //   onSubmit={this.search}
          value={keyword}
          onChange={this.changeValue}
          placeholder="请输入小区或地址"
          onCancel={() => this.props.history.goBack()}
        />
        {list && (
          <ul className={styles.tips}>
            {list.map(item => {
              return (
                <li
                  key={item.community}
                  onClick={() => this.selectCommunity(item)}
                  className={styles.tip}
                >
                  {item.communityName}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(communityActionCreator,dispatch)
}

export default connect(null,mapDispatchToProps)(RentSearch)
