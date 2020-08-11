import { InputBase, withStyles } from '@material-ui/core';

const BootstrapInput = withStyles(() => ({
  root: {
    width: 50,
    height: 35,
  },
}))(InputBase);

export default BootstrapInput;
