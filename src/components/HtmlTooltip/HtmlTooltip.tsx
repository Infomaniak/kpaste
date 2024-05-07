import { Tooltip, TooltipProps, styled } from '@mui/material';

const HtmlTooltip = styled(Tooltip)<TooltipProps>(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#666666',
  maxWidth: 250,
  fontSize: theme.typography.pxToRem(14),
  border: '1px solid #ffffff',
  borderRadius: '4px',
  padding: '10px',
}));

export default HtmlTooltip;