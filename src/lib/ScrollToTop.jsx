import React, { Component } from 'react';

class ScrollToTop extends Component<Props> {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <></>;
  }
}

export default ScrollToTop;
