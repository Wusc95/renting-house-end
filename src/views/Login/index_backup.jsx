import React,{Component} from 'react'
import styles from './index.module.scss'
import MyNavBar from '../../components/MyNavBar'
import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile'
import { setToken } from '../../utils/token'

export default class Login extends Component{
    constructor(){
        super()

        this.state = {
            username: '', // test2
            password: '' // test2
        }
    }


    changeValue = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    login = async e => {
        e.preventDefault()

        const result = await this.axios.post('/user/login',this.state)

        if (result.data.status === 200) {
            // 保存token
            setToken(result.data.body.token)

            // 跳转，返回
            this.props.history.goBack()
        } else {
            Toast.info(result.data.description)
        }
    }

    render() {
        const {username, password} = this.state

        return <div className={styles.root}>
            <MyNavBar title="账号登录" />
            <WhiteSpace size="lg"/>
            <WingBlank>
                <form onSubmit={this.login}>
                    <div className={styles.formItem}>
                        <input value={username} onChange={this.changeValue} name="username" className={styles.input} placeholder="请输入账号" type="text"/>
                    </div>
                    <div className={styles.formItem}>
                        <input value={password} onChange={this.changeValue} name="password" className={styles.input} placeholder="请输入密码" type="password"/>
                    </div>
                    <div className={styles.formSubmit}>
                        <input className={styles.submit} type="submit" value="登录"/>
                    </div>
                </form>
                <Flex className={styles.backHome}>
                    <Flex.Item>
                        <a href="#/">还没有账号，去注册~</a>
                    </Flex.Item>
                </Flex>
            </WingBlank>
        </div>
    }
}