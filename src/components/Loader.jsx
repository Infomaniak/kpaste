import React from 'react';
import logo from '../images/logo.svg';

// eslint-disable-next-line react/prefer-stateless-function
class Loader extends React.PureComponent {
  render() {
    return (
      <div className="App">
        <img src={logo} alt="logo" />
        <div>loading...</div>
      </div>
    );
  }
}

export default Loader;
