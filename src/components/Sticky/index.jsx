import React, { Component } from 'react'
import styles from './index.module.scss'

export default class Sticky extends Component {
    // 占位div的Ref
    placeholderRef = React.createRef()
    // 要吸顶元素的Ref
    contentRef = React.createRef()

    handleScroll = () => {
        // 拿到对应的dom节点
        const placeholderDom = this.placeholderRef.current
        const contentDom = this.contentRef.current

        // 判断 placeholderDom 距离顶部的距离
        const { top } = placeholderDom.getBoundingClientRect()
        
        if (top < 0) {
            placeholderDom.style.height = '40px'
            // 让contentDom吸顶，脱离标准流
            contentDom.classList.add(styles.fixed)
        } else {
            placeholderDom.style.height = '0px'
            contentDom.classList.remove(styles.fixed)
        }
    }

    componentDidMount() {
        window.addEventListener('scroll',this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll',this.handleScroll)
    }

    render() {
        return (
            <div>
                {/* 占位的div */}
                <div ref={this.placeholderRef}></div>
                {/* 要吸顶的子组件 */}
                <div ref={this.contentRef}>
                    { this.props.children }
                </div>
            </div>
        )
    }
}
