import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

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

export default withRouter(ScrollToTop);
