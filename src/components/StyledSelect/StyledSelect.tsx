import { Select, SelectProps, styled } from '@mui/material';

const StyledSelect = styled(Select)<SelectProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: '0 !important',
  paddingLeft: 5,
  backgroundColor: '#F1F1F1',
  textTransform: 'uppercase',
  borderRadius: 4,
  '& .MuiSelect-iconOutlined': {
    right: 4,
  },
}));

export default StyledSelect;
