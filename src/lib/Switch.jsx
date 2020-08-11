import { Switch as MatSwitch, withStyles } from '@material-ui/core';
import React from 'react';

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 44,
    height: 24,
    padding: 0,
    margin: theme.spacing(1),
    overflow: 'visible',
  },
  switchBase: {
    padding: 2,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    padding: 2,
    borderRadius: 26 / 2,
    border: 'none',
    backgroundColor: '#E0E0E0',
    opacity: 1,
    transition: theme.transitions.create(['background-color',
      'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => (
  <MatSwitch
    classes={{
      checked: classes.checked,
      root: classes.root,
      switchBase: classes.switchBase,
      thumb: classes.thumb,
      track: classes.track,
    }}
    disableRipple
    focusVisibleClassName={classes.focusVisible}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props}
  />
));

export default StyledSwitch;
