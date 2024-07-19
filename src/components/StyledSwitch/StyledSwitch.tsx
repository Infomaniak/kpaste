import { Switch, styled } from '@mui/material';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  margin: theme.spacing(1),
  overflow: 'visible',
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 'none',
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  '& .MuiSwitch-thumb': {
    width: 24,
    height: 24,
  },
  '& .MuiSwitch-track': {
    padding: 2,
    borderRadius: 26 / 2,
    border: 'none',
    backgroundColor: '#E0E0E0',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
}));

export default StyledSwitch;