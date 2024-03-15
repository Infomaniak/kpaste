/* global WEB_COMPONENT_API_ENDPOINT */

import { CloseSidePanelMessageKey } from '@infomaniak/ksuite-bridge';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import iconMenu from '../images/menu.svg';
import i18n from '../lib/i18n';
import StyledSelect from '../lib/Select';
import BootstrapInput from '../lib/Input';

/**
 * @extends Component
 */
class IkHeader extends React.PureComponent {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.state = {
      session: null,
    };

    this.onCloseSidepanel = this.onCloseSidepanel.bind(this);
  }

  /**
   * @inheritdoc
   */
  componentDidMount() {
    fetch(
      `${WEB_COMPONENT_API_ENDPOINT}/api/components/profile/me?with=current_group,user,groups,products`, {
        method: 'GET',
        credentials: 'include',
        // eslint-disable-next-line no-confusing-arrow
      },
    ).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))))
      .then((json) => {
        if (json.data.user) {
          if (json.data.user.locale) {
            window.CONST_LANG = json.data.user.locale.substr(0, 2);
            i18n.changeLanguage(json.data.user.locale.substr(0, 2));
          }

          this.setState({
            session: json.data,
          });
        }
      });
  }

  /**
   * @inheritdoc
   */
  static onHandleMenuItemClick(selectedItem) {
    window.CONST_LANG = selectedItem.target.value;
    i18n.changeLanguage(selectedItem.target.value);
  }

  /**
   * Redirect to the login page.
   *
   * @inheritdoc
   */
  static onLogin() {
    window.location = `${WEB_COMPONENT_API_ENDPOINT}/auth/login/paste?uri=${window.location.pathname}`;
  }

  showNotConnectedMenu() {
    const { session } = this.state;
    const { t } = this.props;
    const languages = [
      'fr',
      'en',
      'it',
      'de',
      'es',
    ];

    if (!session || !session.user || session.user.length !== 0) {
      return false;
    }

    return (
      <>
        <div className="select-wrapper" id="menu-lang-selector">
          <StyledSelect
            defaultValue={i18n.language.substr(0, 2)}
            input={<BootstrapInput />}
            onChange={IkHeader.onHandleMenuItemClick}
            variant="outlined"
          >
            {languages.map((option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </div>
        <div className="login">
          <Button
            id="menu-login-button"
            color="primary"
            disableElevation
            onClick={IkHeader.onLogin}
            variant="contained"
          >
            {t('menu.login')}
          </Button>
        </div>
      </>
    );
  }

  showConnectedUserMenu() {
    const { session } = this.state;

    if (!session || !session.user || !session.user.id) {
      return false;
    }

    return (
      <div
        className="relative header-icon-wrapper header-icon-wrapper--hide-overflow"
      >
        <module-menu-user>
          <span slot="trigger">
            <div className="user-avatar-wrapper">
              <module-avatar-component
                firstname={session.user.firstname}
                lastname={session.user.lastname}
                size={40}
                logo={session.user.avatar}
                fontsize={20}
                accountid={session.current_group.id}
              />
            </div>
          </span>
        </module-menu-user>
      </div>
    );
  }

  showProductMenuRight() {
    const { session } = this.state;

    if (!session || !session.user || !session.user.id) {
      return false;
    }

    return (
      <div className="relative header-icon-wrapper">
        <module-products-component position="left">
          <div
            className="header-icon"
            slot="trigger"
          >
            <img
              alt="menu"
              src={iconMenu}
              width="20"
            />
          </div>
        </module-products-component>
      </div>
    );
  }

  /**
     * Closes sidepanel in ksuite context.
     *
     */
  onCloseSidepanel() {
    const { bridge } = this.props;

    bridge.sendMessage({ type: CloseSidePanelMessageKey });
  }

  /**
   * Implements React's {@link Component#render()}.
   *
   * @inheritdoc
   * @returns {ReactElement}
   */
  render() {
    const { bridge } = this.props;
    if (window.location.search.includes('ksuite-mode=side') && bridge && bridge.isConnected) {
      return (
        <header className="ik-header bridge-header">
          <div className="flex flex--v-center">
            <Typography
              style={{
                marginLeft: 32,
                fontSize: 16,
                color: 'black',
              }}
            >
              <strong>kPaste</strong>
            </Typography>
          </div>
          <div className="flex flex--v-center flex--h-center">
            <div
              className="header-icon"
              onClick={this.onCloseSidepanel}
            >
              <SvgIcon style={{ color: '#666' }}>
                <CloseIcon />
              </SvgIcon>
            </div>
          </div>
        </header>
      );
    }

    return (
      <header className="ik-header">
        <div className="flex">
          <div className="header-title-wrapper">
            <module-header-title-component />
          </div>
        </div>
        <div className="flex flex--v-center flex--h-center">
          {this.showProductMenuRight()}
          {this.showConnectedUserMenu()}
          {this.showNotConnectedMenu()}
        </div>
      </header>
    );
  }
}

IkHeader.propTypes = {
  t: PropTypes.func.isRequired,
  bridge: PropTypes.object,
};

export default withTranslation()(IkHeader);
