import React, { Component } from 'react'

const delay = 70

const withDeferRender = Presentational =>
  class DeferRender extends Component {
    state = {
      shouldRender: false
    };

    componentDidMount () {
      this.t = setTimeout(() => {
        this.setState(() => ({ shouldRender: true }))
      }, this.props.index * delay)
    }

    componentWillUnmount () {
      clearTimeout(this.t)
    }

    render () {
      if (!this.state.shouldRender) return null
      return <Presentational {...this.props} />
    }
  }

export default withDeferRender
