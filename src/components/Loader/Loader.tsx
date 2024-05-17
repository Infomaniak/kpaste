import { FC } from 'react';
import logo from '../../images/logo.svg';

const Loader: FC = () => {
  return (
    <div className="App">
      <img src={logo} alt="logo" />
      <div>loading...</div>
    </div>
  );
}

export default Loader;
