import { withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#ffffff',
    color: '#666666',
    maxWidth: 250,
    fontSize: theme.typography.pxToRem(14),
    border: '1px solid #ffffff',
    borderRadius: '4px',
    padding: '10px',
  },
}))(Tooltip);

export default HtmlTooltip;
