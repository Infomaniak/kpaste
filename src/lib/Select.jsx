import { withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import React from 'react';

const StyledSelect = withStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '0 !important',
    paddingLeft: 5,
    width: 50,
    height: 35,
    padding: 0,
    border: 'none',
    backgroundColor: '#F1F1F1',
    textTransform: 'uppercase',
    fontSize: 13,
  },

  iconOutlined: {
    right: 4,
  },
}))(({ classes, ...props }) => (
  <Select
    classes={{
      root: classes.root,
      iconOutlined: classes.iconOutlined,
    }}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props}
  />
));

export default StyledSelect;
